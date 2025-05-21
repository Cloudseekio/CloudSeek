import { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getConnectionInfo } from '../utils/deviceInfo';
import { trackEvent } from '../utils/analytics';
import logger from '../utils/logger';

/**
 * Network quality levels for adaptive prefetching
 */
export type NetworkQuality = 'fast' | 'medium' | 'slow' | 'offline';

/**
 * Prefetch method types
 */
export type PrefetchMethod = 'hover' | 'viewport' | 'prediction' | 'analytics' | 'manual';

/**
 * Options for configuring the prefetch behavior
 */
export interface PrefetchOptions {
  /**
   * Enable or disable prefetching entirely
   */
  enabled?: boolean;
  
  /**
   * Enable hover-based prefetching
   */
  enableHover?: boolean;
  
  /**
   * Delay in milliseconds before prefetching on hover
   */
  hoverDelay?: number;
  
  /**
   * Enable intersection observer-based prefetching for links in viewport
   */
  enableViewport?: boolean;
  
  /**
   * Intersection observer threshold (0-1)
   */
  viewportThreshold?: number;
  
  /**
   * Enable predictive prefetching based on navigation patterns
   */
  enablePrediction?: boolean;
  
  /**
   * Threshold score (0-1) for predictive prefetching
   */
  predictionThreshold?: number;
  
  /**
   * Maximum number of routes to prefetch at once
   */
  maxPrefetchCount?: number;
  
  /**
   * Minimum network quality required for different prefetch methods
   */
  networkThresholds?: {
    prediction: NetworkQuality;
    viewport: NetworkQuality;
    hover: NetworkQuality;
  };
  
  /**
   * Enable debug logging
   */
  debug?: boolean;
  
  /**
   * Custom prefetch function (useful for Next.js, etc.)
   * By default uses React Router's capabilities
   */
  prefetchFunction?: (path: string) => Promise<void>;
  
  /**
   * Callback when prefetching starts
   */
  onPrefetchStart?: (path: string, method: PrefetchMethod) => void;
  
  /**
   * Callback when prefetching succeeds
   */
  onPrefetchSuccess?: (path: string, method: PrefetchMethod) => void;
  
  /**
   * Callback when prefetching fails
   */
  onPrefetchError?: (path: string, error: Error, method: PrefetchMethod) => void;
}

/**
 * Navigation statistics for a route
 */
interface RouteStats {
  path: string;
  visits: number;
  lastVisit: number;
  transitions: Map<string, number>; // Maps to-routes to transition counts
}

/**
 * Get network quality based on connection information
 */
function getNetworkQuality(): NetworkQuality {
  try {
    const connectionInfo = getConnectionInfo();
    
    if (!navigator.onLine) {
      return 'offline';
    }
    
    // Fast connections
    if (
      connectionInfo.effectiveType === '4g' && 
      connectionInfo.downlinkMbps > 5 &&
      connectionInfo.rtt < 100
    ) {
      return 'fast';
    }
    
    // Slow connections
    if (
      connectionInfo.effectiveType === '2g' ||
      connectionInfo.downlinkMbps < 1 ||
      connectionInfo.rtt > 500 ||
      connectionInfo.saveData
    ) {
      return 'slow';
    }
    
    // Everything else is medium
    return 'medium';
  } catch (error) {
    // If we can't determine network quality, assume medium
    return 'medium';
  }
}

/**
 * Check if network meets quality threshold
 */
function meetsNetworkThreshold(current: NetworkQuality, required: NetworkQuality): boolean {
  const qualityLevels: Record<NetworkQuality, number> = {
    'fast': 3,
    'medium': 2,
    'slow': 1,
    'offline': 0
  };
  
  return qualityLevels[current] >= qualityLevels[required];
}

/**
 * Custom hook for intelligent navigation prefetching
 */
export function usePrefetch(options: PrefetchOptions = {}) {
  const {
    enabled = true,
    enableHover = true,
    hoverDelay = 100,
    enableViewport = true,
    viewportThreshold = 0.5,
    enablePrediction = true,
    predictionThreshold = 0.3,
    maxPrefetchCount = 5,
    networkThresholds = {
      prediction: 'slow',
      viewport: 'medium',
      hover: 'fast',
    },
    debug = false,
    prefetchFunction,
    onPrefetchStart,
    onPrefetchSuccess,
    onPrefetchError
  } = options;

  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  // State for tracking network quality
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>(getNetworkQuality());
  
  // Refs for internal state that doesn't need to trigger re-renders
  const routeStatsRef = useRef<Map<string, RouteStats>>(new Map());
  const prefetchedRef = useRef<Set<string>>(new Set());
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const hoverTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  /**
   * Prefetch a route if it hasn't been prefetched yet
   */
  const prefetchRoute = useCallback(async (
    path: string, 
    method: PrefetchMethod
  ) => {
    if (!enabled || !path || path === currentPath || prefetchedRef.current.has(path)) {
      return;
    }
    
    // Check network quality against thresholds
    const currentNetworkQuality = getNetworkQuality();
    let requiredQuality: NetworkQuality = 'medium';
    
    if (method === 'prediction') requiredQuality = networkThresholds.prediction;
    if (method === 'viewport') requiredQuality = networkThresholds.viewport;
    if (method === 'hover') requiredQuality = networkThresholds.hover;
    
    if (!meetsNetworkThreshold(currentNetworkQuality, requiredQuality)) {
      debug && logger.info(`Skipping prefetch of ${path} due to network quality: ${currentNetworkQuality}`);
      return;
    }
    
    try {
      // Mark as prefetched immediately to prevent duplicate prefetches
      prefetchedRef.current.add(path);
      
      // Log and call onPrefetchStart callback
      debug && logger.info(`Prefetching ${path} (method: ${method})`);
      onPrefetchStart?.(path, method);
      
      // Track the prefetch event in analytics
      trackEvent('navigation_prefetch', 'navigation', 'prefetch', {
        path,
        method,
        networkQuality: currentNetworkQuality
      });
      
      if (typeof prefetchFunction === 'function') {
        // Use custom prefetch function if provided
        await prefetchFunction(path);
      } else {
        // Default implementation: fetch HTML
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Failed to prefetch ${path}`);
      }
      
      // Call success callback
      onPrefetchSuccess?.(path, method);
      debug && logger.info(`Successfully prefetched ${path}`);
    } catch (error) {
      // Handle errors and call error callback
      prefetchedRef.current.delete(path); // Allow retry on failure
      debug && logger.error(`Failed to prefetch ${path}: ${error}`);
      onPrefetchError?.(path, error instanceof Error ? error : new Error(String(error)), method);
    }
  }, [
    enabled, currentPath, prefetchFunction, debug, 
    networkThresholds, onPrefetchStart, 
    onPrefetchSuccess, onPrefetchError
  ]);

  /**
   * Track route visits and transitions
   */
  useEffect(() => {
    if (!enabled || !enablePrediction) return;
    
    // Get previous path
    const prevPath = document.referrer ? new URL(document.referrer).pathname : null;
    
    // Update stats for current path
    const stats = routeStatsRef.current.get(currentPath) || {
      path: currentPath,
      visits: 0,
      lastVisit: Date.now(),
      transitions: new Map()
    };
    
    stats.visits += 1;
    stats.lastVisit = Date.now();
    routeStatsRef.current.set(currentPath, stats);
    
    // Update transition stats if we have a previous path
    if (prevPath && prevPath !== currentPath) {
      const prevStats = routeStatsRef.current.get(prevPath) || {
        path: prevPath,
        visits: 0,
        lastVisit: Date.now(),
        transitions: new Map()
      };
      
      const count = prevStats.transitions.get(currentPath) || 0;
      prevStats.transitions.set(currentPath, count + 1);
      routeStatsRef.current.set(prevPath, prevStats);
    }
    
    // Save stats to sessionStorage
    try {
      const serialized = JSON.stringify(
        Array.from(routeStatsRef.current.entries())
      );
      sessionStorage.setItem('route_stats', serialized);
    } catch (e) {
      // Ignore storage errors
    }
    
    // Predict and prefetch likely next routes
    predictAndPrefetch();
  }, [currentPath]);

  /**
   * Restore route stats from sessionStorage
   */
  useEffect(() => {
    if (!enabled || !enablePrediction) return;
    
    try {
      const saved = sessionStorage.getItem('route_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        const restored = new Map(parsed);
        routeStatsRef.current = restored;
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, [enabled, enablePrediction]);
  
  /**
   * Update network quality periodically
   */
  useEffect(() => {
    if (!enabled) return;
    
    const checkNetworkQuality = () => {
      const newQuality = getNetworkQuality();
      if (newQuality !== networkQuality) {
        setNetworkQuality(newQuality);
      }
    };
    
    // Check initially
    checkNetworkQuality();
    
    // Set up periodic checking and event listeners
    const intervalId = setInterval(checkNetworkQuality, 10000);
    
    const handleOnline = () => setNetworkQuality(getNetworkQuality());
    const handleOffline = () => setNetworkQuality('offline');
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enabled, networkQuality]);

  /**
   * Predict and prefetch likely next routes
   */
  const predictAndPrefetch = useCallback(() => {
    if (!enabled || !enablePrediction || networkQuality === 'offline') return;
    
    // Calculate route probabilities
    const predictions = calculateRoutePredictions();
    
    // Filter by threshold and limit count
    const routesToPrefetch = predictions
      .filter(pred => pred.score >= predictionThreshold)
      .slice(0, maxPrefetchCount);
    
    // Prefetch filtered routes
    for (const prediction of routesToPrefetch) {
      prefetchRoute(prediction.path, 'prediction');
    }
  }, [
    enabled, enablePrediction, networkQuality, 
    predictionThreshold, maxPrefetchCount, prefetchRoute
  ]);
  
  /**
   * Calculate route predictions based on navigation history
   */
  const calculateRoutePredictions = useCallback(() => {
    const stats = routeStatsRef.current.get(currentPath);
    if (!stats) return [];
    
    const predictions: Array<{path: string; score: number}> = [];
    const currentStats = routeStatsRef.current;
    
    // Get total transitions from current route
    let totalTransitions = 0;
    stats.transitions.forEach(count => {
      totalTransitions += count;
    });
    
    // Calculate probabilities for each destination
    stats.transitions.forEach((count, path) => {
      // Basic transition probability
      let score = totalTransitions > 0 ? count / totalTransitions : 0;
      
      // Skip current path
      if (path === currentPath) return;
      
      // Skip already prefetched paths
      if (prefetchedRef.current.has(path)) return;
      
      // Adjust score based on recency and visit count
      const destStats = currentStats.get(path);
      if (destStats) {
        // Boost score for frequently visited pages
        const visitBoost = Math.min(destStats.visits / 10, 0.5);
        
        // Boost score for recently visited pages (within last hour)
        const hourAgo = Date.now() - 60 * 60 * 1000;
        const recencyBoost = destStats.lastVisit > hourAgo ? 0.2 : 0;
        
        score = score * 0.7 + visitBoost * 0.2 + recencyBoost * 0.1;
      }
      
      predictions.push({ path, score });
    });
    
    // Sort by score descending
    return predictions.sort((a, b) => b.score - a.score);
  }, [currentPath]);

  /**
   * Setup intersection observer for viewport-based prefetching
   */
  const setupViewportPrefetching = useCallback(() => {
    if (!enabled || !enableViewport || networkQuality === 'offline') return;
    
    // Clean up existing observer
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();
    }
    
    // Create new IntersectionObserver
    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target instanceof HTMLAnchorElement) {
            const href = entry.target.getAttribute('href');
            if (href && href.startsWith('/')) {
              prefetchRoute(href, 'viewport');
            }
          }
        });
      },
      { threshold: viewportThreshold }
    );
    
    // Observe all internal links
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      intersectionObserverRef.current?.observe(link);
    });
    
    return () => {
      intersectionObserverRef.current?.disconnect();
    };
  }, [enabled, enableViewport, networkQuality, viewportThreshold, prefetchRoute]);
  
  /**
   * Setup hover-based prefetching
   */
  const setupHoverPrefetching = useCallback(() => {
    if (!enabled || !enableHover || networkQuality === 'offline') return;
    
    // Clean up existing listeners
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      link.removeEventListener('mouseenter', handleLinkMouseEnter);
      link.removeEventListener('touchstart', handleLinkTouchStart);
      link.removeEventListener('mouseleave', handleLinkMouseLeave);
      link.removeEventListener('touchend', handleLinkTouchEnd);
    });
    
    // Clear any pending timeouts
    hoverTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    hoverTimeoutsRef.current.clear();
    
    // Add listeners to all internal links
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      link.addEventListener('mouseenter', handleLinkMouseEnter);
      link.addEventListener('touchstart', handleLinkTouchStart);
      link.addEventListener('mouseleave', handleLinkMouseLeave);
      link.addEventListener('touchend', handleLinkTouchEnd);
    });
    
    return () => {
      document.querySelectorAll('a[href^="/"]').forEach(link => {
        link.removeEventListener('mouseenter', handleLinkMouseEnter);
        link.removeEventListener('touchstart', handleLinkTouchStart);
        link.removeEventListener('mouseleave', handleLinkMouseLeave);
        link.removeEventListener('touchend', handleLinkTouchEnd);
      });
      
      // Clear any pending timeouts
      hoverTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      hoverTimeoutsRef.current.clear();
    };
  }, [enabled, enableHover, networkQuality]);
  
  /**
   * Handle mouse enter event for hover prefetching
   */
  const handleLinkMouseEnter = useCallback((e: Event) => {
    if (!enabled || !enableHover || networkQuality === 'offline') return;
    
    const link = e.currentTarget as HTMLAnchorElement;
    const href = link.getAttribute('href');
    
    if (href && href.startsWith('/')) {
      // Clear any existing timeout for this link
      if (hoverTimeoutsRef.current.has(href)) {
        clearTimeout(hoverTimeoutsRef.current.get(href)!);
      }
      
      // Set new timeout
      const timeoutId = setTimeout(() => {
        prefetchRoute(href, 'hover');
        hoverTimeoutsRef.current.delete(href);
      }, hoverDelay);
      
      hoverTimeoutsRef.current.set(href, timeoutId);
    }
  }, [enabled, enableHover, networkQuality, hoverDelay, prefetchRoute]);
  
  /**
   * Handle touch start event for mobile prefetching
   */
  const handleLinkTouchStart = useCallback((e: Event) => {
    // On mobile, we use touchstart similar to mouseenter
    handleLinkMouseEnter(e);
  }, [handleLinkMouseEnter]);
  
  /**
   * Handle mouse leave event to cancel prefetch
   */
  const handleLinkMouseLeave = useCallback((e: Event) => {
    const link = e.currentTarget as HTMLAnchorElement;
    const href = link.getAttribute('href');
    
    if (href && hoverTimeoutsRef.current.has(href)) {
      clearTimeout(hoverTimeoutsRef.current.get(href)!);
      hoverTimeoutsRef.current.delete(href);
    }
  }, []);
  
  /**
   * Handle touch end event to cancel prefetch
   */
  const handleLinkTouchEnd = useCallback((e: Event) => {
    // On mobile, we use touchend similar to mouseleave
    handleLinkMouseLeave(e);
  }, [handleLinkMouseLeave]);
  
  /**
   * Set up all prefetching methods when component mounts
   */
  useEffect(() => {
    if (!enabled) return;
    
    const cleanupViewport = setupViewportPrefetching();
    const cleanupHover = setupHoverPrefetching();
    
    // Run an immediate prediction
    if (enablePrediction) {
      predictAndPrefetch();
    }
    
    // Clean up all observers and event listeners
    return () => {
      if (cleanupViewport) cleanupViewport();
      if (cleanupHover) cleanupHover();
    };
  }, [
    enabled, setupViewportPrefetching, 
    setupHoverPrefetching, enablePrediction, 
    predictAndPrefetch
  ]);
  
  /**
   * Manually prefetch a specific route
   */
  const prefetch = useCallback((path: string) => {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    return prefetchRoute(path, 'manual');
  }, [prefetchRoute]);
  
  /**
   * Clear prefetch cache (useful for testing)
   */
  const clearPrefetchCache = useCallback(() => {
    prefetchedRef.current.clear();
  }, []);

  return {
    /** Current network quality */
    networkQuality,
    
    /** Manually prefetch a route */
    prefetch,
    
    /** Get list of prefetched routes */
    getPrefetchedRoutes: () => Array.from(prefetchedRef.current),
    
    /** Clear prefetch cache */
    clearPrefetchCache,
    
    /** Navigate to a route (wrapper around React Router's navigate) */
    navigate,
    
    /** Current path */
    currentPath
  };
} 