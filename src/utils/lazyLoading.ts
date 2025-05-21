import { lazy, ComponentType, LazyExoticComponent, useEffect, createElement } from 'react';
import { performanceMonitor } from './performanceMonitoring';

type LazyModule<T> = Promise<{ default: T }>;

interface LazyOptions {
  minimumLoadingDelay?: number;
  timeout?: number;
  preload?: boolean;
  tags?: Record<string, string>;
}

/**
 * Enhanced lazy loading utility that includes performance monitoring
 * and additional options like minimum loading delay and timeout
 */
export function lazyLoad<Props>(
  factory: () => LazyModule<ComponentType<Props>>,
  options: LazyOptions = {}
): LazyExoticComponent<ComponentType<Props>> {
  const {
    minimumLoadingDelay = 200,
    timeout = 10000,
    preload = false,
    tags
  } = options;

  const delay = new Promise<void>(resolve => 
    setTimeout(resolve, minimumLoadingDelay)
  );

  const timeoutPromise = new Promise<never>((_, reject) => 
    setTimeout(() => reject(new Error('Component load timed out')), timeout)
  );

  const monitoredFactory = () =>
    performanceMonitor.measure<{ default: ComponentType<Props> }>(
      'component.lazy.load',
      async () => {
        const [module] = await Promise.all([
          factory(),
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

  const LazyComponent = lazy(() =>
    Promise.race([monitoredFactory(), timeoutPromise])
  );

  if (preload) {
    monitoredFactory();
  }

  return LazyComponent;
}

/**
 * Preloads a component by triggering its import
 */
export function preloadComponent<Props>(
  factory: () => LazyModule<ComponentType<Props>>,
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
  components: Record<string, () => LazyModule<ComponentType<unknown>>>
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
export function withPreload<Props extends Record<string, unknown>>(
  Component: ComponentType<Props>,
  preloadFn: () => Promise<void>
) {
  const PreloadComponent = (props: Props) => {
    useEffect(() => {
      preloadFn().catch(error => {
        console.error('Failed to preload:', error);
      });
    }, []);

    return createElement(Component, props);
  };

  PreloadComponent.displayName = `withPreload(${
    Component.displayName || Component.name || 'Component'
  })`;

  return PreloadComponent;
} 