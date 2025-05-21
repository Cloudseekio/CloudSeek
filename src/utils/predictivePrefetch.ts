import { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor } from './performanceMonitoring';
import logger from './logger';

interface UserBehaviorMetrics {
  // Scroll metrics
  scrollSpeed: number;
  scrollDirection: 'up' | 'down' | null;
  scrollPosition: number;
  // Time metrics
  timeOnPage: number;
  timePerItem: number;
  // Interaction metrics
  clickCount: number;
  hoverDuration: number;
  // Session metrics
  sessionDuration: number;
  pageViews: number;
}

interface PrefetchStrategy {
  // Threshold for triggering prefetch
  probability: number;
  // Number of items to prefetch
  batchSize: number;
  // Cooldown between prefetch attempts (ms)
  cooldown: number;
  // Maximum concurrent prefetch requests
  maxConcurrent: number;
  // Cache TTL (ms)
  cacheTTL: number;
}

interface RouteStats {
  path: string;
  visits: number;
  lastVisit: number;
  transitions: Map<string, number>; // Maps to-routes to transition counts
}

interface PrefetchOptions {
  /**
   * Maximum number of routes to prefetch at once
   */
  maxPrefetchCount: number;
  
  /**
   * Score threshold for prefetching (0-1)
   */
  prefetchThreshold: number;
  
  /**
   * Maximum age of stats to consider in milliseconds
   */
  maxStatsAge: number;
  
  /**
   * Prefetch immediately on hover over links
   */
  enableHoverPrefetch: boolean;
  
  /**
   * Prefetch based on scroll position (towards end of page)
   */
  enableScrollPrefetch: boolean;
}

const defaultStrategy: PrefetchStrategy = {
  probability: 0.8,
  batchSize: 10,
  cooldown: 5000,
  maxConcurrent: 2,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
};

class PredictivePrefetcher {
  private routeStats: Map<string, RouteStats> = new Map();
  private currentRoute: string | null = null;
  private prefetchQueue: Set<string> = new Set();
  private prefetchFunction: ((path: string) => Promise<void>) | null = null;
  private hoverListeners: Map<HTMLElement, () => void> = new Map();
  private options: PrefetchOptions;
  
  constructor(options?: Partial<PrefetchOptions>) {
    this.options = {
      maxPrefetchCount: 3,
      prefetchThreshold: 0.3, // 30% chance threshold
      maxStatsAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      enableHoverPrefetch: true,
      enableScrollPrefetch: true,
      ...options
    };
    
    // Try to load saved stats from localStorage
    this.loadStats();
    
    // Set up scroll listener if enabled
    if (this.options.enableScrollPrefetch) {
      this.setupScrollListener();
    }
  }
  
  /**
   * Register the prefetch function to be used
   */
  registerPrefetchFunction(prefetchFn: (path: string) => Promise<void>): void {
    this.prefetchFunction = prefetchFn;
  }
  
  /**
   * Track a route visit
   */
  trackRouteVisit(path: string): void {
    const now = Date.now();
    
    // Update transition if we have a current route
    if (this.currentRoute && this.currentRoute !== path) {
      const currentStats = this.routeStats.get(this.currentRoute);
      if (currentStats) {
        const currentTransitions = currentStats.transitions;
        currentTransitions.set(
          path, 
          (currentTransitions.get(path) || 0) + 1
        );
      }
    }
    
    // Update or create stats for the new route
    const existingStats = this.routeStats.get(path);
    if (existingStats) {
      existingStats.visits += 1;
      existingStats.lastVisit = now;
    } else {
      this.routeStats.set(path, {
        path,
        visits: 1,
        lastVisit: now,
        transitions: new Map()
      });
    }
    
    this.currentRoute = path;
    this.saveStats();
    
    // Trigger prefetch prediction after a short delay
    setTimeout(() => this.predictNextRoutes(), 1500);
  }
  
  /**
   * Predict and prefetch likely next routes
   */
  predictNextRoutes(): void {
    if (!this.currentRoute || !this.prefetchFunction) {
      return;
    }
    
    performanceMonitor.measure('predictive.prefetch.predict', async () => {
      const predictions = this.calculateRoutePredictions();
      
      // Filter predictions above threshold and take top N
      const routesToPrefetch = predictions
        .filter(p => p.score > this.options.prefetchThreshold)
        .slice(0, this.options.maxPrefetchCount);
      
      if (routesToPrefetch.length === 0) {
        return;
      }
      
      logger.debug(
        `Predictively prefetching ${routesToPrefetch.length} routes:`,
        routesToPrefetch.map(p => `${p.path} (score: ${p.score.toFixed(2)})`)
      );
      
      // Prefetch each route
      for (const prediction of routesToPrefetch) {
        if (!this.prefetchQueue.has(prediction.path)) {
          this.prefetchQueue.add(prediction.path);
          
          this.prefetchFunction(prediction.path)
            .then(() => {
              performanceMonitor.record('predictive.prefetch.success', 1, 'count', { 
                path: prediction.path,
                score: prediction.score.toString()
              });
            })
            .catch(error => {
              logger.warn(`Failed to prefetch route ${prediction.path}:`, error);
              performanceMonitor.record('predictive.prefetch.error', 1, 'count', {
                path: prediction.path,
                error: error instanceof Error ? error.message : String(error)
              });
            })
            .finally(() => {
              this.prefetchQueue.delete(prediction.path);
            });
        }
      }
    }).catch(error => {
      logger.error('Error in predictive prefetching:', error);
    });
  }
  
  /**
   * Calculate score-based predictions for next routes
   */
  private calculateRoutePredictions(): Array<{path: string; score: number}> {
    if (!this.currentRoute) {
      return [];
    }
    
    const currentStats = this.routeStats.get(this.currentRoute);
    if (!currentStats || currentStats.transitions.size === 0) {
      return [];
    }
    
    const now = Date.now();
    const predictions: Array<{path: string; score: number}> = [];
    
    // Calculate the total transitions from this route
    let totalTransitions = 0;
    currentStats.transitions.forEach(count => {
      totalTransitions += count;
    });
    
    // Calculate score for each destination route
    currentStats.transitions.forEach((count, path) => {
      // Skip current route
      if (path === this.currentRoute) {
        return;
      }
      
      // Get stats for the target route
      const targetStats = this.routeStats.get(path);
      if (!targetStats) {
        return;
      }
      
      // Skip if stats are too old
      const statsAge = now - targetStats.lastVisit;
      if (statsAge > this.options.maxStatsAge) {
        return;
      }
      
      // Base score is transition probability
      let score = count / totalTransitions;
      
      // Adjust by recency (more recent = higher score)
      const recencyFactor = Math.max(0, 1 - (statsAge / this.options.maxStatsAge));
      score *= (0.7 + (recencyFactor * 0.3));
      
      // Adjust by popularity (more visits = higher score)
      const popularityFactor = Math.min(1, targetStats.visits / 10); // Cap at 10 visits
      score *= (0.8 + (popularityFactor * 0.2));
      
      predictions.push({ path, score });
    });
    
    // Sort by score (highest first)
    return predictions.sort((a, b) => b.score - a.score);
  }
  
  /**
   * Setup hover prefetching for links
   */
  setupLinkHoverPrefetching(): void {
    if (!this.options.enableHoverPrefetch || !this.prefetchFunction) {
      return;
    }
    
    // Cleanup any existing listeners
    this.cleanupHoverListeners();
    
    // Find all internal links and add hover listeners
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href === this.currentRoute) {
        return;
      }
      
      const hoverHandler = () => {
        if (this.prefetchFunction && !this.prefetchQueue.has(href)) {
          logger.debug(`Prefetching on hover: ${href}`);
          this.prefetchQueue.add(href);
          
          this.prefetchFunction(href)
            .then(() => {
              performanceMonitor.record('hover.prefetch.success', 1, 'count', { path: href });
            })
            .catch(() => {})
            .finally(() => {
              this.prefetchQueue.delete(href);
            });
        }
      };
      
      link.addEventListener('mouseenter', hoverHandler);
      this.hoverListeners.set(link as HTMLElement, hoverHandler);
    });
  }
  
  /**
   * Clean up hover listeners
   */
  private cleanupHoverListeners(): void {
    this.hoverListeners.forEach((handler, element) => {
      element.removeEventListener('mouseenter', handler);
    });
    this.hoverListeners.clear();
  }
  
  /**
   * Setup scroll-based prefetching
   */
  private setupScrollListener(): void {
    let scrollTimeout: number | null = null;
    
    const handleScroll = () => {
      if (scrollTimeout !== null) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = window.setTimeout(() => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const docHeight = document.body.scrollHeight;
        const scrollPercentage = scrollPosition / docHeight;
        
        // If user has scrolled past 70% of the page, predict next routes
        if (scrollPercentage > 0.7) {
          this.predictNextRoutes();
        }
      }, 200) as unknown as number;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  /**
   * Save route stats to localStorage
   */
  private saveStats(): void {
    try {
      // Convert the complex Map structure to a serializable object
      const serializableStats = Array.from(this.routeStats.entries()).map(([path, stats]) => {
        return {
          path,
          visits: stats.visits,
          lastVisit: stats.lastVisit,
          transitions: Array.from(stats.transitions.entries())
        };
      });
      
      localStorage.setItem('predictive-prefetch-stats', JSON.stringify(serializableStats));
    } catch (error) {
      logger.warn('Failed to save predictive prefetch stats:', error);
    }
  }
  
  /**
   * Load route stats from localStorage
   */
  private loadStats(): void {
    try {
      const savedStats = localStorage.getItem('predictive-prefetch-stats');
      if (!savedStats) {
        return;
      }
      
      const parsed = JSON.parse(savedStats);
      
      // Clear expired stats
      const now = Date.now();
      const maxAge = this.options.maxStatsAge;
      
      parsed.forEach((item: any) => {
        if (now - item.lastVisit <= maxAge) {
          const transitions = new Map();
          item.transitions.forEach(([path, count]: [string, number]) => {
            transitions.set(path, count);
          });
          
          this.routeStats.set(item.path, {
            path: item.path,
            visits: item.visits,
            lastVisit: item.lastVisit,
            transitions
          });
        }
      });
    } catch (error) {
      logger.warn('Failed to load predictive prefetch stats:', error);
    }
  }
  
  /**
   * Reset all collected stats
   */
  resetStats(): void {
    this.routeStats.clear();
    this.currentRoute = null;
    localStorage.removeItem('predictive-prefetch-stats');
  }
}

// Create and export a singleton instance
export const predictivePrefetcher = new PredictivePrefetcher();

// Export the class for testing and custom instances
export type { RouteStats, PrefetchOptions };
export { PredictivePrefetcher };

/**
 * Hook for implementing predictive prefetching
 */
export function usePredictivePrefetch(options: PrefetchOptions) {
  const {
    fetchData,
    strategy: strategyOptions = {},
    onPrefetch,
    onError,
  } = options;

  const strategy = { ...defaultStrategy, ...strategyOptions };

  // Refs for tracking behavior and state
  const metrics = useRef<UserBehaviorMetrics>({
    scrollSpeed: 0,
    scrollDirection: null,
    scrollPosition: 0,
    timeOnPage: 0,
    timePerItem: 0,
    clickCount: 0,
    hoverDuration: 0,
    sessionDuration: 0,
    pageViews: 1,
  });

  const state = useRef({
    lastPrefetchTime: 0,
    concurrentRequests: 0,
    prefetchedCursors: new Set<string>(),
    cache: new Map<string, { data: unknown[]; timestamp: number }>(),
  });

  // Clean up expired cache entries
  const cleanupCache = useCallback(() => {
    const now = Date.now();
    for (const [key, entry] of state.current.cache.entries()) {
      if (now - entry.timestamp > strategy.cacheTTL) {
        state.current.cache.delete(key);
        state.current.prefetchedCursors.delete(key);
      }
    }
  }, [strategy.cacheTTL]);

  // Calculate prefetch probability based on user behavior
  const calculatePrefetchProbability = useCallback(() => {
    const {
      scrollSpeed,
      scrollDirection,
      timePerItem,
      hoverDuration,
      sessionDuration,
    } = metrics.current;

    // Base probability from strategy
    let probability = strategy.probability;

    // Adjust based on scroll behavior
    if (scrollDirection === 'down' && scrollSpeed > 0) {
      probability *= 1.2; // Increase probability when scrolling down
    }

    // Adjust based on time spent per item
    if (timePerItem > 0) {
      const avgTimePerItem = sessionDuration / metrics.current.pageViews;
      if (timePerItem < avgTimePerItem) {
        probability *= 1.3; // User is scanning quickly
      }
    }

    // Adjust based on hover behavior
    if (hoverDuration > 1000) {
      probability *= 0.8; // User is reading carefully
    }

    return Math.min(1, Math.max(0, probability));
  }, [strategy.probability]);

  // Attempt to prefetch data
  const attemptPrefetch = useCallback(async (cursor?: string) => {
    const now = Date.now();
    
    // Check cooldown and concurrent requests
    if (
      now - state.current.lastPrefetchTime < strategy.cooldown ||
      state.current.concurrentRequests >= strategy.maxConcurrent ||
      state.current.prefetchedCursors.has(cursor || '')
    ) {
      return;
    }

    // Calculate probability
    const probability = calculatePrefetchProbability();
    if (Math.random() > probability) {
      return;
    }

    try {
      state.current.concurrentRequests++;
      state.current.lastPrefetchTime = now;

      const result = await fetchData({
        cursor,
        limit: strategy.batchSize,
      });

      // Cache the results
      if (result.items.length > 0) {
        const key = cursor || 'initial';
        state.current.cache.set(key, {
          data: result.items,
          timestamp: now,
        });
        state.current.prefetchedCursors.add(key);
        onPrefetch?.(result.items);

        // Recursively prefetch next batch if probability is high
        if (result.nextCursor && probability > 0.9) {
          void attemptPrefetch(result.nextCursor);
        }
      }
    } catch (error) {
      onError?.(error as Error);
    } finally {
      state.current.concurrentRequests--;
    }
  }, [
    fetchData,
    strategy.cooldown,
    strategy.maxConcurrent,
    strategy.batchSize,
    calculatePrefetchProbability,
    onPrefetch,
    onError,
  ]);

  // Update scroll metrics
  const updateScrollMetrics = useCallback((event: Event) => {
    const target = event.target as Document;
    const scrollTop = target.documentElement.scrollTop;
    const timestamp = Date.now();

    // Calculate scroll speed and direction
    const deltaY = scrollTop - metrics.current.scrollPosition;
    const deltaTime = timestamp - metrics.current.timeOnPage;
    
    metrics.current.scrollSpeed = Math.abs(deltaY / deltaTime);
    metrics.current.scrollDirection = deltaY > 0 ? 'down' : 'up';
    metrics.current.scrollPosition = scrollTop;
    metrics.current.timeOnPage = timestamp;

    // Attempt prefetch on scroll
    void attemptPrefetch();
  }, [attemptPrefetch]);

  // Update interaction metrics
  const updateInteractionMetrics = useCallback((event: MouseEvent) => {
    const timestamp = Date.now();

    if (event.type === 'click') {
      metrics.current.clickCount++;
    } else if (event.type === 'mouseover') {
      metrics.current.hoverDuration = timestamp - metrics.current.timeOnPage;
    }

    // Attempt prefetch on interaction
    void attemptPrefetch();
  }, [attemptPrefetch]);

  // Set up event listeners and cleanup
  useEffect(() => {
    const pageLoadTime = window.performance?.timing.loadEventEnd - 
                        window.performance?.timing.navigationStart;

    // Initialize session metrics
    metrics.current.sessionDuration = pageLoadTime || 0;
    metrics.current.timePerItem = 0;

    // Set up event listeners
    document.addEventListener('scroll', updateScrollMetrics);
    document.addEventListener('click', updateInteractionMetrics);
    document.addEventListener('mouseover', updateInteractionMetrics);

    // Start cache cleanup interval
    const cleanupInterval = setInterval(cleanupCache, strategy.cacheTTL / 2);

    return () => {
      document.removeEventListener('scroll', updateScrollMetrics);
      document.removeEventListener('click', updateInteractionMetrics);
      document.removeEventListener('mouseover', updateInteractionMetrics);
      clearInterval(cleanupInterval);
    };
  }, [updateScrollMetrics, updateInteractionMetrics, cleanupCache, strategy.cacheTTL]);

  return {
    // Get prefetched data
    getPrefetchedData: (cursor?: string) => {
      const key = cursor || 'initial';
      const entry = state.current.cache.get(key);
      return entry && Date.now() - entry.timestamp <= strategy.cacheTTL
        ? entry.data
        : null;
    },
    // Clear prefetch cache
    clearCache: () => {
      state.current.cache.clear();
      state.current.prefetchedCursors.clear();
    },
    // Force prefetch
    forcePrefetch: (cursor?: string) => attemptPrefetch(cursor),
    // Get current metrics
    getMetrics: () => ({ ...metrics.current }),
  };
} 