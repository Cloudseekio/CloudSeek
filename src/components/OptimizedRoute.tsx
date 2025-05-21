import React, { Suspense, useEffect, ComponentType, useCallback } from 'react';
import { useResourceHints } from '../hooks/useResourceHints';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { lazyLoad } from '../utils/lazyLoading';
import { performanceMonitor } from '../utils/performanceMonitoring';
import { predictivePrefetcher } from '../utils/predictivePrefetch';
import { useLocation } from 'react-router-dom';

interface ResourceConfig {
  url: string;
  as?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

interface OptimizedRouteProps<Props> {
  /**
   * Component to render
   */
  component: () => Promise<{ default: ComponentType<Props> }>;
  /**
   * Resources to optimize
   */
  resources?: {
    preload?: ResourceConfig[];
    prefetch?: ResourceConfig[];
    preconnect?: ResourceConfig[];
    dnsPrefetch?: { url: string }[];
  };
  /**
   * Loading component to show while the main component is loading
   */
  loading?: ComponentType;
  /**
   * Error component to show if the main component fails to load
   */
  error?: ComponentType<{ error: Error }>;
  /**
   * Additional props to pass to the component
   */
  componentProps?: Props;
  /**
   * Path associated with this route (used for predictive prefetching)
   */
  path?: string;
  /**
   * Enable predictive prefetching (default: true)
   */
  enablePredictivePrefetch?: boolean;
}

/**
 * A route component that implements performance optimizations
 */
export function OptimizedRoute<Props>({
  component,
  resources = {},
  loading: Loading,
  error: ErrorComponent,
  componentProps,
  path,
  enablePredictivePrefetch = true
}: OptimizedRouteProps<Props>) {
  const location = useLocation();
  const currentPath = path || location.pathname;
  
  const { preloadRoute } = useResourceHints({
    preload: resources.preload?.map(r => ({ ...r, type: 'preload' as const })),
    prefetch: resources.prefetch?.map(r => ({ ...r, type: 'prefetch' as const })),
    preconnect: resources.preconnect?.map(r => ({ ...r, type: 'preconnect' as const })),
    dnsPrefetch: resources.dnsPrefetch?.map(r => ({ ...r, type: 'dns-prefetch' as const }))
  });

  const metrics = usePerformanceMetrics({
    componentName: 'OptimizedRoute'
  });
  
  /**
   * Preload a specific route
   */
  const prefetchRoute = useCallback(async (routePath: string) => {
    try {
      // For demonstration - in a real app, this would use your route config
      // to determine the actual component to load based on the path
      performanceMonitor.record('route.prefetch.attempt', 1, 'count', { path: routePath });
      
      // This is just a placeholder - in a real app, you would:
      // 1. Find the component for this route path
      // 2. Preload that component
      // 3. Preload any critical resources for that route
      
      // Example of what this might look like with a real route config:
      // const routeConfig = findRouteByPath(routePath);
      // if (routeConfig) {
      //   await import(routeConfig.component);
      //   if (routeConfig.resources?.preload) {
      //     await preloadRoute(routeConfig.resources.preload);
      //   }
      // }
      
      performanceMonitor.record('route.prefetch.success', 1, 'count', { path: routePath });
    } catch (error) {
      performanceMonitor.record('route.prefetch.error', 1, 'count', { 
        path: routePath,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }, []);

  // Register the prefetch function with the predictive prefetcher
  useEffect(() => {
    if (enablePredictivePrefetch) {
      predictivePrefetcher.registerPrefetchFunction(prefetchRoute);
    }
  }, [prefetchRoute, enablePredictivePrefetch]);

  // Track route visit for the predictive prefetcher
  useEffect(() => {
    if (enablePredictivePrefetch && currentPath) {
      predictivePrefetcher.trackRouteVisit(currentPath);
    }
    
    // Set up hover-based prefetching
    const timeoutId = setTimeout(() => {
      if (enablePredictivePrefetch) {
        predictivePrefetcher.setupLinkHoverPrefetching();
      }
    }, 1000); // Delay to avoid unnecessary work during initial render
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentPath, enablePredictivePrefetch]);

  // Preload critical resources when route mounts
  useEffect(() => {
    if (resources.preload?.length) {
      metrics.measureInteraction('preload-resources', async () => {
        try {
          await preloadRoute(resources.preload!.map(r => ({ ...r, type: 'preload' as const })));
        } catch (error) {
          performanceMonitor.record(
            'route.preload.error',
            1,
            'count',
            { error: error instanceof Error ? error.message : String(error) }
          );
          throw error;
        }
      });
    }
  }, [resources.preload, preloadRoute, metrics]);

  // Create optimized lazy component
  const Component = lazyLoad<Props>(component, {
    minimumLoadingDelay: 200,
    timeout: 10000,
    tags: { route: component.name }
  });

  return (
    <Suspense
      fallback={
        Loading ? (
          <Loading />
        ) : (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
          </div>
        )
      }
    >
      <ErrorBoundary
        fallback={error =>
          ErrorComponent ? (
            <ErrorComponent error={error} />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-error">
              <h2 className="text-lg font-semibold">Error Loading Route</h2>
              <p className="text-sm">{error.message}</p>
            </div>
          )
        }
      >
        <Component {...componentProps} />
      </ErrorBoundary>
    </Suspense>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: (error: Error) => React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Error boundary component for handling component errors
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error): void {
    performanceMonitor.record(
      'route.error',
      1,
      'count',
      { error: error.message }
    );
  }

  render(): React.ReactNode {
    if (this.state.error) {
      return this.props.fallback(this.state.error);
    }

    return this.props.children;
  }
} 