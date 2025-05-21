import React, { ComponentType, Suspense } from 'react';
import { ErrorBoundary } from '../components/error/ErrorBoundary';
import logger from './logger';

export interface BundleOptions {
  fallback?: React.ReactNode;
  errorBoundary?: boolean;
  preload?: boolean;
  timeout?: number;
  onError?: (error: Error) => void;
}

type BundleModule<T> = { default: T };

/**
 * Creates a lazy-loaded component with enhanced error handling and loading states
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFactory: () => Promise<BundleModule<T>>,
  options: BundleOptions = {}
): React.ComponentType<React.ComponentProps<T>> {
  const {
    fallback = <div>Loading...</div>,
    errorBoundary = true,
    timeout,
    onError
  } = options;

  const LazyComponent = React.lazy(async () => {
    try {
      if (timeout) {
        const result = await Promise.race([
          importFactory(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Loading timeout')), timeout)
          )
        ]);
        return result;
      }
      return await importFactory();
    } catch (error) {
      logger.error('Failed to load component:', error);
      onError?.(error as Error);
      throw error;
    }
  });

  function WrappedComponent(props: React.ComponentProps<T>): JSX.Element {
    return (
      <Suspense fallback={fallback}>
        {errorBoundary ? (
          <ErrorBoundary onError={onError}>
            <LazyComponent {...props} />
          </ErrorBoundary>
        ) : (
          <LazyComponent {...props} />
        )}
      </Suspense>
    );
  }

  WrappedComponent.displayName = `LazyLoaded(${LazyComponent.displayName || 'Component'})`;
  return WrappedComponent;
}

/**
 * Preloads a component bundle before it's needed
 */
export function preloadComponent<T extends ComponentType<any>>(
  importFactory: () => Promise<BundleModule<T>>
): Promise<void> {
  return importFactory()
    .then(() => {
      logger.debug('Component preloaded successfully');
    })
    .catch(error => {
      logger.error('Failed to preload component:', error);
      throw error;
    });
}

/**
 * Creates a route-based code split point with enhanced loading behavior
 */
export function createRouteSplitPoint<T extends ComponentType<any>>(
  importFactory: () => Promise<BundleModule<T>>,
  options: BundleOptions = {}
): React.ComponentType<React.ComponentProps<T>> {
  const Component = createLazyComponent(importFactory, {
    fallback: <div>Loading route...</div>,
    ...options,
  });

  if (options.preload) {
    preloadComponent(importFactory).catch(error => {
      logger.warn('Failed to preload route:', error);
    });
  }

  return Component;
}

/**
 * Prefetches multiple component bundles in parallel
 */
export function prefetchComponents(
  factories: Array<() => Promise<BundleModule<ComponentType<any>>>>
): void {
  Promise.all(factories.map(factory => 
    preloadComponent(factory).catch(error => {
      logger.warn('Failed to prefetch component:', error);
      return null;
    })
  )).then(() => {
    logger.debug('All components prefetched');
  });
}

/**
 * HOC that wraps a component with code splitting capabilities
 */
export function withCodeSplitting<P extends object>(
  importFactory: () => Promise<BundleModule<ComponentType<P>>>,
  options: BundleOptions = {}
): React.FC<P> {
  function WithCodeSplitting(props: P): JSX.Element {
    const Component = createLazyComponent(importFactory, options);
    return <Component {...props} />;
  }
  WithCodeSplitting.displayName = 'WithCodeSplitting';
  return WithCodeSplitting;
} 