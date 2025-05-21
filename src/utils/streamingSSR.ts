import { Suspense, lazy, ComponentType } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'stream';

interface StreamingOptions {
  // Time to wait before sending shell HTML (in ms)
  shellTimeout?: number;
  // Time to abort full rendering (in ms)
  renderTimeout?: number;
  // Whether to enable progressive hydration
  enableProgressiveHydration?: boolean;
  // Custom error handling
  onError?: (error: Error) => void;
  // Custom shell renderer
  renderShell?: () => React.ReactNode;
}

interface StreamingResult {
  // The readable stream of HTML
  stream: PassThrough;
  // Promise that resolves when critical content is ready
  criticalReady: Promise<void>;
  // Promise that resolves when all content is ready
  allReady: Promise<void>;
}

/**
 * Creates a streaming SSR pipeline
 */
export function createStreamingSSR(options: StreamingOptions = {}) {
  const {
    shellTimeout = 1000,
    renderTimeout = 10000,
    enableProgressiveHydration = true,
    onError,
    renderShell,
  } = options;

  return function streamingRenderer(
    App: ComponentType,
    props: Record<string, unknown>
  ): StreamingResult {
    const stream = new PassThrough();
    let criticalResolve: () => void;
    let allResolve: () => void;

    const criticalReady = new Promise<void>((resolve) => {
      criticalResolve = resolve;
    });

    const allReady = new Promise<void>((resolve) => {
      allResolve = resolve;
    });

    const { pipe } = renderToPipeableStream(
      <Suspense fallback={renderShell?.() || null}>
        <App {...props} />
      </Suspense>,
      {
        bootstrapScripts: ['/client.js'],
        onShellReady() {
          // Shell is ready, start streaming
          pipe(stream);
          criticalResolve();
        },
        onAllReady() {
          // All content is ready
          allResolve();
        },
        onError(error: Error) {
          // Handle errors
          onError?.(error);
          stream.end();
        },
        progressiveChunks: enableProgressiveHydration,
      }
    );

    // Set timeouts
    setTimeout(() => {
      criticalResolve();
    }, shellTimeout);

    setTimeout(() => {
      allResolve();
      stream.end();
    }, renderTimeout);

    return {
      stream,
      criticalReady,
      allReady,
    };
  };
}

/**
 * HOC for creating streaming-ready components
 */
export function withStreaming<P extends object>(
  Component: ComponentType<P>,
  options: {
    fallback?: React.ReactNode;
    suspense?: boolean;
    preload?: boolean;
  } = {}
) {
  const {
    fallback,
    suspense = true,
    preload = true,
  } = options;

  const StreamingComponent = lazy(() => 
    Promise.resolve({ default: Component })
  );

  function WrappedComponent(props: P) {
    if (!suspense) {
      return <Component {...props} />;
    }

    return (
      <Suspense fallback={fallback || null}>
        <StreamingComponent {...props} />
      </Suspense>
    );
  }

  if (preload) {
    WrappedComponent.preload = () => Promise.resolve();
  }

  return WrappedComponent;
}

/**
 * Hook for managing streaming boundaries
 */
export function useStreamingBoundary(options: {
  fallback?: React.ReactNode;
  timeout?: number;
} = {}) {
  const { fallback, timeout = 2000 } = options;

  return function StreamingBoundary({ children }: { children: React.ReactNode }) {
    return (
      <Suspense fallback={fallback || null}>
        {children}
      </Suspense>
    );
  };
}

/**
 * Creates a streaming data loader
 */
export function createStreamingLoader<T>(
  loader: () => Promise<T>,
  options: {
    timeout?: number;
    retries?: number;
    onError?: (error: Error) => void;
  } = {}
) {
  const {
    timeout = 5000,
    retries = 3,
    onError,
  } = options;

  let cache: T | null = null;
  let error: Error | null = null;
  let promise: Promise<T> | null = null;

  return function load(): T {
    if (cache) {
      return cache;
    }

    if (error) {
      throw error;
    }

    if (!promise) {
      promise = new Promise<T>((resolve, reject) => {
        let attempts = 0;

        const attempt = () => {
          const timeoutId = setTimeout(() => {
            if (attempts < retries) {
              attempts++;
              void attempt();
            } else {
              const timeoutError = new Error('Streaming data load timeout');
              error = timeoutError;
              onError?.(timeoutError);
              reject(timeoutError);
            }
          }, timeout);

          loader()
            .then((data) => {
              clearTimeout(timeoutId);
              cache = data;
              resolve(data);
            })
            .catch((err) => {
              clearTimeout(timeoutId);
              if (attempts < retries) {
                attempts++;
                void attempt();
              } else {
                error = err;
                onError?.(err);
                reject(err);
              }
            });
        };

        void attempt();
      });
    }

    throw promise;
  };
}

/**
 * Creates a streaming data provider
 */
export function createStreamingProvider<T>(
  initialData: T,
  options: {
    revalidate?: boolean;
    revalidateInterval?: number;
    onUpdate?: (data: T) => void;
  } = {}
) {
  const {
    revalidate = true,
    revalidateInterval = 30000,
    onUpdate,
  } = options;

  let data = initialData;
  let subscribers = new Set<(data: T) => void>();

  function subscribe(callback: (data: T) => void) {
    subscribers.add(callback);
    return () => {
      subscribers.delete(callback);
    };
  }

  function update(newData: T) {
    data = newData;
    onUpdate?.(newData);
    subscribers.forEach(callback => callback(newData));
  }

  if (revalidate) {
    setInterval(() => {
      // Trigger revalidation
      subscribers.forEach(callback => callback(data));
    }, revalidateInterval);
  }

  return {
    subscribe,
    update,
    getData: () => data,
  };
} 