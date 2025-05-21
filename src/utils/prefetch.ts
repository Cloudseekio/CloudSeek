import { useEffect, useCallback, useRef } from 'react';

type ResourceType = 'image' | 'style' | 'script' | 'font';
type PriorityType = 'high' | 'low' | 'auto';
type ResourceHintType = 'prefetch' | 'preload' | 'preconnect';

interface PrefetchOptions {
  // Resource prefetching options
  resources?: {
    urls: string[];
    type: ResourceType;
    priority?: PriorityType;
  }[];
  // Data prefetching options
  data?: {
    key: string;
    fetcher: () => Promise<unknown>;
    condition?: () => boolean;
  }[];
  // Predictive prefetching options
  predictive?: {
    threshold?: number; // Probability threshold for prefetching
    maxConcurrent?: number; // Maximum concurrent prefetch requests
  };
}

// Cache to store prefetched data
const prefetchCache = new Map<string, unknown>();
// Cache to store in-flight prefetch promises
const prefetchPromiseCache = new Map<string, Promise<unknown>>();
// Cache to track resource load status
const resourceLoadCache = new Map<string, boolean>();

/**
 * Creates a resource hint link element
 */
const createResourceHint = (
  url: string,
  type: ResourceHintType,
  as?: string,
  priority?: PriorityType
): HTMLLinkElement => {
  const link = document.createElement('link');
  link.rel = type;
  link.href = url;
  if (as) link.setAttribute('as', as);
  if (priority) link.setAttribute('importance', priority);
  return link;
};

/**
 * Prefetches a resource using the appropriate strategy
 */
const prefetchResource = (
  url: string,
  type: ResourceType,
  priority: PriorityType = 'auto'
): void => {
  if (resourceLoadCache.has(url)) return;

  const as = type === 'image' ? 'image' : 
             type === 'style' ? 'style' :
             type === 'script' ? 'script' : 'font';

  const hint = createResourceHint('prefetch' as ResourceHintType, url, as, priority);
  document.head.appendChild(hint);
  resourceLoadCache.set(url, true);
};

/**
 * Prefetches data using the provided fetcher function
 */
const prefetchData = async <T>(key: string, fetcher: () => Promise<T>): Promise<T> => {
  if (prefetchCache.has(key)) return prefetchCache.get(key) as T;
  
  const existingPromise = prefetchPromiseCache.get(key) as Promise<T> | undefined;
  if (existingPromise) {
    return existingPromise;
  }

  const promise = fetcher()
    .then(data => {
      prefetchCache.set(key, data);
      prefetchPromiseCache.delete(key);
      return data;
    })
    .catch(error => {
      prefetchPromiseCache.delete(key);
      throw error;
    });

  prefetchPromiseCache.set(key, promise);
  return promise;
};

/**
 * Hook for implementing advanced prefetching strategies
 */
export const usePrefetch = (options: PrefetchOptions) => {
  const predictiveTimeoutRef = useRef<NodeJS.Timeout>();
  const concurrentRequestsRef = useRef<number>(0);

  // Clear prefetch cache
  const clearCache = useCallback((key?: string) => {
    if (key) {
      prefetchCache.delete(key);
    } else {
      prefetchCache.clear();
    }
  }, []);

  // Get prefetched data
  const getPrefetchedData = useCallback(<T>(key: string): T | undefined => {
    return prefetchCache.get(key) as T;
  }, []);

  // Handle resource prefetching
  useEffect(() => {
    if (!options.resources) return;

    options.resources.forEach(({ urls, type, priority }) => {
      urls.forEach(url => prefetchResource(url, type, priority));
    });
  }, [options.resources]);

  // Handle data prefetching
  useEffect(() => {
    if (!options.data) return;

    options.data.forEach(({ key, fetcher, condition }) => {
      if (condition && !condition()) return;
      void prefetchData(key, fetcher).catch(console.error);
    });
  }, [options.data]);

  // Handle predictive prefetching
  useEffect(() => {
    if (!options.predictive) return;

    const {
      threshold = 0.8,
      maxConcurrent = 3
    } = options.predictive;

    const handlePredictivePrefetch = () => {
      if (concurrentRequestsRef.current >= maxConcurrent) return;

      options.data?.forEach(({ key, fetcher, condition }) => {
        if (condition && !condition()) return;
        if (Math.random() > threshold) return;
        if (prefetchCache.has(key) || prefetchPromiseCache.has(key)) return;

        concurrentRequestsRef.current++;
        void prefetchData(key, fetcher).finally(() => {
          concurrentRequestsRef.current--;
        });
      });
    };

    predictiveTimeoutRef.current = setInterval(handlePredictivePrefetch, 2000);

    return () => {
      if (predictiveTimeoutRef.current) {
        clearInterval(predictiveTimeoutRef.current);
      }
    };
  }, [options.predictive, options.data]);

  return {
    clearCache,
    getPrefetchedData,
    prefetchResource,
    prefetchData
  };
};

// Export individual utilities for direct usage
export {
  prefetchResource,
  prefetchData,
  prefetchCache,
  resourceLoadCache
}; 