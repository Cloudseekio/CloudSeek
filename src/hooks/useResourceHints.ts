import { useEffect, useCallback } from 'react';
import { resourceHints, type ResourceHint } from '../utils/resourceHints';

interface UseResourceHintsOptions {
  /**
   * Resources to preload immediately
   */
  preload?: ResourceHint[];
  /**
   * Resources to prefetch when idle
   */
  prefetch?: ResourceHint[];
  /**
   * Resources to preconnect to
   */
  preconnect?: ResourceHint[];
  /**
   * Resources to DNS prefetch
   */
  dnsPrefetch?: ResourceHint[];
  /**
   * Whether to automatically clean up hints when component unmounts
   */
  cleanupOnUnmount?: boolean;
}

/**
 * Hook for managing resource hints in components
 */
export function useResourceHints({
  preload = [],
  prefetch = [],
  preconnect = [],
  dnsPrefetch = [],
  cleanupOnUnmount = true
}: UseResourceHintsOptions = {}) {
  // Add hints when component mounts
  useEffect(() => {
    const hints: ResourceHint[] = [
      ...preload.map(hint => ({ ...hint, type: 'preload' as const })),
      ...prefetch.map(hint => ({ ...hint, type: 'prefetch' as const })),
      ...preconnect.map(hint => ({ ...hint, type: 'preconnect' as const })),
      ...dnsPrefetch.map(hint => ({ ...hint, type: 'dns-prefetch' as const }))
    ];

    resourceHints.addHints(hints);

    // Clean up hints when component unmounts
    return () => {
      if (cleanupOnUnmount) {
        hints.forEach(hint => resourceHints.removeHint(hint));
      }
    };
  }, [preload, prefetch, preconnect, dnsPrefetch, cleanupOnUnmount]);

  // Helper function to add a single hint
  const addHint = useCallback((hint: ResourceHint) => {
    resourceHints.addHint(hint);
  }, []);

  // Helper function to remove a single hint
  const removeHint = useCallback((hint: ResourceHint) => {
    resourceHints.removeHint(hint);
  }, []);

  // Helper function to preload a route's resources
  const preloadRoute = useCallback((resources: ResourceHint[]) => {
    return resourceHints.preloadRoute(resources);
  }, []);

  return {
    addHint,
    removeHint,
    preloadRoute
  };
} 