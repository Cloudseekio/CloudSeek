import logger from './logger';
import { performanceMonitor } from './performanceMonitoring';

export interface ResourceOptions {
  cache?: boolean;
  timeout?: number;
  retries?: number;
  cacheKey?: string;
  cacheTime?: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

const resourceCache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRIES = 3;

interface ResourceHint {
  url: string;
  type: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch';
  as?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

interface ResourceOptimizationOptions {
  /**
   * Maximum number of concurrent resource loads
   */
  maxConcurrentLoads?: number;
  /**
   * Priority levels for different resource types
   */
  priorities?: Record<string, number>;
  /**
   * Whether to automatically remove hints after they're used
   */
  autoCleanup?: boolean;
}

class ResourceOptimizer {
  private hints: Set<ResourceHint> = new Set();
  private loadingResources: Set<string> = new Set();
  private options: Required<ResourceOptimizationOptions>;

  constructor(options: ResourceOptimizationOptions = {}) {
    this.options = {
      maxConcurrentLoads: options.maxConcurrentLoads ?? 6,
      priorities: {
        preload: 3,
        preconnect: 2,
        prefetch: 1,
        'dns-prefetch': 0,
        ...options.priorities
      },
      autoCleanup: options.autoCleanup ?? true
    };

    this.observeResourceTiming();
  }

  /**
   * Adds a resource hint
   */
  addHint(hint: ResourceHint): void {
    this.hints.add(hint);
    this.processHints();
  }

  /**
   * Adds multiple resource hints
   */
  addHints(hints: ResourceHint[]): void {
    hints.forEach(hint => this.hints.add(hint));
    this.processHints();
  }

  /**
   * Removes a resource hint
   */
  removeHint(hint: ResourceHint): void {
    this.hints.delete(hint);
  }

  /**
   * Clears all resource hints
   */
  clearHints(): void {
    this.hints.clear();
  }

  /**
   * Gets all current resource hints
   */
  getHints(): ResourceHint[] {
    return Array.from(this.hints);
  }

  /**
   * Processes resource hints based on priority and concurrency limits
   */
  private processHints(): void {
    if (this.loadingResources.size >= this.options.maxConcurrentLoads) {
      return;
    }

    const sortedHints = Array.from(this.hints)
      .sort((a, b) => {
        const priorityA = this.options.priorities[a.type] ?? 0;
        const priorityB = this.options.priorities[b.type] ?? 0;
        return priorityB - priorityA;
      })
      .slice(0, this.options.maxConcurrentLoads - this.loadingResources.size);

    sortedHints.forEach(hint => {
      if (!this.loadingResources.has(hint.url)) {
        this.applyHint(hint);
      }
    });
  }

  /**
   * Applies a resource hint by creating the appropriate link element
   */
  private applyHint(hint: ResourceHint): void {
    const link = document.createElement('link');
    link.rel = hint.type;
    link.href = hint.url;

    if (hint.as) {
      link.as = hint.as;
    }

    if (hint.crossOrigin) {
      link.crossOrigin = hint.crossOrigin;
    }

    this.loadingResources.add(hint.url);
    document.head.appendChild(link);

    performanceMonitor.record(
      'resource.hint.applied',
      1,
      'count',
      { type: hint.type, url: hint.url }
    );
  }

  /**
   * Observes resource timing entries to track loading performance
   */
  private observeResourceTiming(): void {
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        const url = entry.name;
        
        if (this.loadingResources.has(url)) {
          performanceMonitor.recordResourceTiming(entry as PerformanceResourceTiming);
          
          if (this.options.autoCleanup) {
            this.hints.forEach(hint => {
              if (hint.url === url) {
                this.removeHint(hint);
              }
            });
          }

          this.loadingResources.delete(url);
          this.processHints();
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  /**
   * Preloads critical resources for a route
   */
  preloadRoute(resources: ResourceHint[]): Promise<void[]> {
    const criticalResources = resources.filter(r => r.type === 'preload');
    this.addHints(criticalResources);

    const promises = criticalResources.map(resource => {
      return new Promise<void>((resolve, reject) => {
        performanceMonitor
          .measure(
            'resource.preload',
            () => {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.href = resource.url;
              if (resource.as) {
                link.as = resource.as;
              }
              if (resource.crossOrigin) {
                link.crossOrigin = resource.crossOrigin;
              }

              link.onload = () => resolve();
              link.onerror = () => reject(new Error(`Failed to preload: ${resource.url}`));

              document.head.appendChild(link);
            },
            { url: resource.url }
          )
          .catch(error => {
            performanceMonitor.record(
              'resource.preload.error',
              1,
              'count',
              { url: resource.url, error: error instanceof Error ? error.message : String(error) }
            );
            throw error;
          });
      });
    });

    // Add non-critical resources after critical ones
    const nonCriticalResources = resources.filter(r => r.type !== 'preload');
    setTimeout(() => this.addHints(nonCriticalResources), 0);

    return Promise.all(promises);
  }
}

// Create a singleton instance
export const resourceOptimizer = new ResourceOptimizer();

// Export types and class for testing or custom instances
export type { ResourceHint, ResourceOptimizationOptions };
export { ResourceOptimizer };

/**
 * Loads a resource with caching and retry capabilities
 */
export async function loadResource<T>(
  url: string,
  options: ResourceOptions = {}
): Promise<T> {
  const {
    cache = true,
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    cacheKey = url,
    cacheTime = DEFAULT_CACHE_TIME
  } = options;

  // Check cache first
  if (cache) {
    const cached = getCachedResource<T>(cacheKey);
    if (cached) {
      logger.debug('Resource loaded from cache:', { url, cacheKey });
      return cached;
    }
  }

  let lastError: Error | null = null;
  
  // Attempt to load with retries
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetchWithTimeout(url, timeout);
      const data = await response.json() as T;

      if (cache) {
        cacheResource(cacheKey, data, cacheTime);
      }

      return data;
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Failed to load resource (attempt ${i + 1}/${retries}):`, { 
        url, 
        error: lastError.message 
      });
      
      if (i < retries - 1) {
        await delay(Math.pow(2, i) * 1000); // Exponential backoff
      }
    }
  }

  throw lastError || new Error(`Failed to load resource: ${url}`);
}

/**
 * Preloads resources for future use
 */
export function preloadResources(
  urls: string[],
  options: ResourceOptions = {}
): void {
  urls.forEach(url => {
    loadResource(url, { ...options, cache: true })
      .catch(error => {
        logger.warn('Failed to preload resource:', { url, error: error.message });
      });
  });
}

/**
 * Fetches a resource with timeout
 */
async function fetchWithTimeout(
  url: string,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Gets a resource from cache if available and not expired
 */
function getCachedResource<T>(key: string): T | null {
  const entry = resourceCache.get(key) as CacheEntry<T> | undefined;
  
  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiry) {
    resourceCache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Caches a resource with expiration
 */
function cacheResource<T>(
  key: string,
  data: T,
  cacheTime: number
): void {
  resourceCache.set(key, {
    data,
    timestamp: Date.now(),
    expiry: Date.now() + cacheTime
  });
}

/**
 * Clears expired cache entries
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  for (const [key, entry] of resourceCache.entries()) {
    if (now > entry.expiry) {
      resourceCache.delete(key);
    }
  }
}

/**
 * Sets cache expiry for specific resources
 */
export function setCacheExpiry(url: string, expiryMs: number): void {
  const entry = resourceCache.get(url);
  if (entry) {
    entry.expiry = Date.now() + expiryMs;
  }
}

/**
 * Invalidates cache entries
 */
export function invalidateCache(urls?: string[]): void {
  if (urls) {
    urls.forEach(url => resourceCache.delete(url));
  } else {
    resourceCache.clear();
  }
}

/**
 * Utility function for delay
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Prefetches resources for future use
 */
export function prefetchResources(
  urls: string[],
  options: ResourceOptions = {}
): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(
      () => {
        urls.forEach(url => {
          loadResource(url, options).catch(() => {
            // Ignore prefetch errors
          });
        });
      },
      { timeout: 2000 }
    );
  } else {
    setTimeout(() => {
      urls.forEach(url => {
        loadResource(url, options).catch(() => {
          // Ignore prefetch errors
        });
      });
    }, 0);
  }
}

// Periodically clean up expired cache entries
setInterval(clearExpiredCache, 60000); // Clean up every minute 