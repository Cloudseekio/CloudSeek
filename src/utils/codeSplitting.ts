import React, { lazy, Suspense, type ComponentType, type LazyExoticComponent, useEffect } from 'react';
import LoadingFallback from '../components/LoadingFallback';
import logger from './logger';
import { performanceMonitor } from './performanceMonitoring';

export interface CodeSplittingOptions {
  fallback?: React.ReactNode;
  errorBoundary?: boolean;
  preload?: boolean;
  timeout?: number;
  onError?: (error: Error) => void;
}

const DEFAULT_OPTIONS: CodeSplittingOptions = {
  fallback: React.createElement(LoadingFallback),
  errorBoundary: true,
  preload: false,
  timeout: 10000,
};

type LazyModule<T> = Promise<{ default: T }>;

/**
 * Creates a lazy-loaded component with enhanced error handling and loading states
 */
export function createLazyComponent<T extends ComponentType<P>, P = unknown>(
  importFactory: () => LazyModule<T>,
  options: CodeSplittingOptions = {}
) {
  const { fallback, timeout, onError } = { ...DEFAULT_OPTIONS, ...options };

  const LazyComponent = lazy(() => {
    const loadComponent = async () => {
      try {
        const start = performance.now();
        const result = await Promise.race([
          importFactory(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Component load timeout')), timeout)
          ),
        ]);
        const duration = performance.now() - start;
        
        logger.debug('Component loaded', {
          duration: `${duration.toFixed(2)}ms`,
          component: importFactory.toString()
        });
        
        return result;
      } catch (error) {
        logger.error('Failed to load component', {
          error: error instanceof Error ? error.message : 'Unknown error',
          component: importFactory.toString()
        });
        onError?.(error as Error);
        throw error;
      }
    };

    return loadComponent();
  });

  const WrappedComponent = (props: P) => 
    React.createElement(
      Suspense,
      { fallback },
      React.createElement(LazyComponent, props)
    );

  // Add display name for debugging
  const componentName = (LazyComponent as LazyExoticComponent<T> & { displayName?: string }).displayName || 'LazyComponent';
  WrappedComponent.displayName = `Lazy(${componentName})`;

  return WrappedComponent;
}

/**
 * Preloads a component by triggering its import
 */
export function preloadComponent<T extends ComponentType<unknown>>(
  importFactory: () => LazyModule<T>
) {
  return importFactory().catch(error => {
    logger.error('Failed to preload component', {
      error: error instanceof Error ? error.message : 'Unknown error',
      component: importFactory.toString()
    });
  });
}

/**
 * Creates a route-based code split point with automatic preloading
 */
export function createRouteSplitPoint<T extends ComponentType<P>, P = unknown>(
  importFactory: () => LazyModule<T>,
  options: CodeSplittingOptions = {}
) {
  const LazyComponent = createLazyComponent<T, P>(importFactory, options);

  if (options.preload) {
    // Preload after initial render
    setTimeout(() => preloadComponent(importFactory), 0);
  }

  return LazyComponent;
}

/**
 * HOC that adds code splitting to a component
 */
export function withCodeSplitting<P extends object>(
  importFactory: () => LazyModule<ComponentType<P>>,
  options: CodeSplittingOptions = {}
) {
  const LazyComponent = createLazyComponent(importFactory, options);
  return LazyComponent;
}

interface LazyOptions {
  /**
   * Minimum delay before showing loading state
   */
  minimumLoadingDelay?: number;
  /**
   * Maximum time to wait before timing out
   */
  timeout?: number;
  /**
   * Whether to preload the component
   */
  preload?: boolean;
  /**
   * Tags for performance monitoring
   */
  tags?: Record<string, string>;
}

/**
 * Enhanced lazy loading utility that includes performance monitoring
 * and additional options like minimum loading delay and timeout
 */
export function lazyLoad<T extends ComponentType<any>>(
  factory: () => LazyModule<T>,
  options: LazyOptions = {}
): LazyExoticComponent<T> {
  const {
    minimumLoadingDelay = 200,
    timeout = 10000,
    preload = false,
    tags
  } = options;

  // Create a promise that resolves after minimum delay
  const delay = new Promise<void>(resolve => 
    setTimeout(resolve, minimumLoadingDelay)
  );

  // Create a promise that rejects after timeout
  const timeoutPromise = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('Component load timed out')), timeout)
  );

  // Wrap the import with performance monitoring
  const monitoredFactory = () =>
    performanceMonitor.measure<{ default: T }>(
      'component.lazy.load',
      async () => {
        const [module] = await Promise.all([
          factory(),
          // Wait for minimum delay to avoid flash of loading state
          delay
        ]);
        return module;
      },
      tags
    ).catch(error => {
      performanceMonitor.record(
        'component.lazy.error',
        1,
        'count',
        { ...tags, error: error instanceof Error ? error.message : String(error) }
      );
      throw error;
    });

  // Create the lazy component with timeout
  const LazyComponent = lazy(() =>
    Promise.race([monitoredFactory(), timeoutPromise])
  );

  // Preload if requested
  if (preload) {
    monitoredFactory();
  }

  return LazyComponent;
}

/**
 * Preloads a component by triggering its import
 */
export function preloadComponent<T extends ComponentType<any>>(
  factory: () => LazyModule<T>,
  tags?: Record<string, string>
): Promise<void> {
  return performanceMonitor
    .measure(
      'component.preload',
      () => factory().then(() => undefined),
      tags
    )
    .catch(error => {
      performanceMonitor.record(
        'component.preload.error',
        1,
        'count',
        { ...tags, error: error instanceof Error ? error.message : String(error) }
      );
      throw error;
    });
}

/**
 * Creates a preloader function for multiple components
 */
export function createPreloader(
  components: Record<string, () => LazyModule<ComponentType<any>>>
) {
  return (componentIds: string[]) => {
    return Promise.all(
      componentIds.map(id => {
        const factory = components[id];
        if (!factory) {
          console.warn(`No component found with id: ${id}`);
          return Promise.resolve();
        }
        return preloadComponent(factory, { componentId: id });
      })
    );
  };
}

/**
 * HOC that adds preloading behavior to a component
 */
export function withPreload<P extends object>(
  Component: ComponentType<P>,
  preloadFn: () => Promise<void>
) {
  const PreloadComponent = (props: P) => {
    useEffect(() => {
      preloadFn().catch(error => {
        console.error('Failed to preload:', error);
      });
    }, []);

    return React.createElement(Component, props);
  };

  PreloadComponent.displayName = `withPreload(${
    Component.displayName || Component.name || 'Component'
  })`;

  return PreloadComponent;
}

interface SplitOptions {
  minimumLoadDelay?: number;
  timeout?: number;
  prefetch?: boolean;
  priority?: 'high' | 'low';
  retryStrategy?: {
    maxRetries: number;
    backoffMs: number;
  };
}

interface RouteConfig {
  path: string;
  component: () => Promise<{ default: ComponentType }>;
  preload?: boolean;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  );
}

/**
 * Creates a split component with enhanced loading control
 */
export function createSplitComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: SplitOptions = {}
) {
  const {
    minimumLoadDelay = 200,
    timeout = 10000,
    prefetch = false,
    priority = 'low',
    retryStrategy,
  } = options;

  let loadPromise: Promise<{ default: T }> | null = null;
  let retryCount = 0;

  const load = async () => {
    try {
      const [module] = await Promise.all([
        importFn(),
        new Promise(resolve => setTimeout(resolve, minimumLoadDelay))
      ]);

      return module;
    } catch (error) {
      if (retryStrategy && retryCount < retryStrategy.maxRetries) {
        retryCount++;
        await new Promise(resolve => 
          setTimeout(resolve, retryStrategy.backoffMs * retryCount)
        );
        return load();
      }
      throw error;
    }
  };

  const LazyComponent = lazy(() => {
    if (!loadPromise) {
      loadPromise = load();
    }
    return loadPromise;
  });

  const WrappedComponent = (props: any) => (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );

  if (prefetch) {
    WrappedComponent.preload = () => {
      if (!loadPromise) {
        loadPromise = load();
      }
      return loadPromise;
    };
  }

  return WrappedComponent;
}

/**
 * Route-based code splitting utility
 */
export function createRouteSplitting(routes: RouteConfig[]) {
  const routeModules = new Map<string, Promise<{ default: ComponentType }>>();

  routes.forEach(route => {
    if (route.preload) {
      routeModules.set(route.path, route.component());
    }
  });

  return {
    getComponent: (path: string) => {
      const route = routes.find(r => r.path === path);
      if (!route) return null;

      let modulePromise = routeModules.get(path);
      if (!modulePromise) {
        modulePromise = route.component();
        routeModules.set(path, modulePromise);
      }

      return createSplitComponent(() => modulePromise, {
        prefetch: route.preload,
        priority: route.preload ? 'high' : 'low'
      });
    },

    preloadRoute: (path: string) => {
      const route = routes.find(r => r.path === path);
      if (!route) return;

      if (!routeModules.has(path)) {
        routeModules.set(path, route.component());
      }
    },

    preloadAll: () => {
      routes.forEach(route => {
        if (!routeModules.has(route.path)) {
          routeModules.set(route.path, route.component());
        }
      });
    },

    clearCache: () => {
      routeModules.clear();
    }
  };
}

/**
 * Component bundle analyzer
 */
export function analyzeBundles() {
  if (typeof window === 'undefined') return null;

  return {
    getBundleSizes: () => {
      const resources = performance.getEntriesByType('resource');
      return resources
        .filter(r => r.name.endsWith('.js') || r.name.endsWith('.css'))
        .map(r => ({
          name: r.name.split('/').pop() || '',
          size: r.encodedBodySize,
          transferSize: r.transferSize,
          loadTime: r.duration
        }));
    },

    getBundleLoadTiming: () => {
      const timing = performance.timing;
      return {
        totalLoadTime: timing.loadEventEnd - timing.navigationStart,
        scriptLoadTime: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
        resourceLoadTime: timing.loadEventEnd - timing.domContentLoadedEventEnd
      };
    },

    monitorChunkLoading: (callback: (stats: {
      chunkName: string;
      loadTime: number;
      size: number;
    }) => void) => {
      const observer = new PerformanceObserver((list) => {
        list.getEntries()
          .filter(entry => entry.name.includes('chunk'))
          .forEach(entry => {
            callback({
              chunkName: entry.name.split('/').pop() || '',
              loadTime: entry.duration,
              size: (entry as any).encodedBodySize || 0
            });
          });
      });

      observer.observe({ entryTypes: ['resource'] });
      return () => observer.disconnect();
    }
  };
}

/**
 * Dynamic import with enhanced error handling and retry logic
 */
export async function dynamicImport<T>(
  importFn: () => Promise<T>,
  options: {
    retry?: boolean;
    maxRetries?: number;
    backoff?: number;
    timeout?: number;
  } = {}
): Promise<T> {
  const {
    retry = true,
    maxRetries = 3,
    backoff = 1000,
    timeout = 10000
  } = options;

  let attempts = 0;

  const attempt = async (): Promise<T> => {
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Import timeout')), timeout);
      });

      return await Promise.race([
        importFn(),
        timeoutPromise
      ]);
    } catch (error) {
      if (retry && attempts < maxRetries) {
        attempts++;
        await new Promise(resolve => 
          setTimeout(resolve, backoff * attempts)
        );
        return attempt();
      }
      throw error;
    }
  };

  return attempt();
} 