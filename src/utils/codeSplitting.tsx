import React, { lazy, Suspense, ComponentType, PropsWithChildren } from 'react';

export interface SplitOptions {
  fallback?: React.ReactNode;
  delay?: number;
  retry?: number;
  preload?: boolean;
}

interface RouteConfig {
  path: string;
  component: () => Promise<{ default: ComponentType }>;
  preload?: boolean;
}

interface PerformanceEntryWithSize extends PerformanceResourceTiming {
  encodedBodySize: number;
  transferSize: number;
}

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="spinner" />
  </div>
);

type AnyProps = Record<string, unknown>;

export function createSplitComponent<Props extends AnyProps = AnyProps>(
  importFn: () => Promise<{ default: ComponentType<Props> }>,
  options: SplitOptions = {}
) {
  const {
    fallback = <LoadingSpinner />,
    delay = 200,
    retry = 3,
    preload = false
  } = options;

  const LazyComponent = lazy(async () => {
    await new Promise(resolve => setTimeout(resolve, delay));
    let lastError;
    
    for (let i = 0; i < retry; i++) {
      try {
        const module = await importFn();
        return module;
      } catch (error) {
        lastError = error;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    
    throw lastError;
  });

  const WrappedComponent = React.forwardRef<unknown, Props>((props, ref) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));

  return Object.assign(WrappedComponent, {
    preload: () => importFn()
  });
}

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

export function analyzeBundles() {
  if (typeof window === 'undefined') return null;

  return {
    getBundleSizes: () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resources
        .filter(r => r.name.endsWith('.js') || r.name.endsWith('.css'))
        .map(r => ({
          name: r.name.split('/').pop() || '',
          size: (r as PerformanceEntryWithSize).encodedBodySize,
          transferSize: (r as PerformanceEntryWithSize).transferSize,
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
            const resourceEntry = entry as PerformanceEntryWithSize;
            callback({
              chunkName: entry.name.split('/').pop() || '',
              loadTime: entry.duration,
              size: resourceEntry.encodedBodySize
            });
          });
      });

      observer.observe({ entryTypes: ['resource'] });
      return () => observer.disconnect();
    }
  };
}

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