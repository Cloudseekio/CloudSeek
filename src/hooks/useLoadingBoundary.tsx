import React, { Suspense, useCallback, useState } from 'react';
import { performanceMonitor } from '../utils/performanceMonitoring';

interface LoadingBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  timeout?: number;
  onTimeout?: () => void;
  name?: string;
}

interface UseLoadingBoundaryResult {
  LoadingBoundary: React.FC<LoadingBoundaryProps>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
}

/**
 * Default loading indicator component
 */
const DefaultLoadingIndicator: React.FC = () => (
  <div role="status" className="loading-indicator">
    <div className="spinner" />
    <span className="sr-only">Loading...</span>
  </div>
);

/**
 * Loading boundary component that shows a fallback while content is loading
 */
const LoadingBoundary: React.FC<LoadingBoundaryProps> = ({
  children,
  fallback = <DefaultLoadingIndicator />,
  timeout,
  onTimeout
}) => {
  const handleTimeout = useCallback(() => {
    if (timeout && onTimeout) {
      setTimeout(() => {
        onTimeout();
      }, timeout);
    }
  }, [timeout, onTimeout]);

  // Use requestIdleCallback for timeout handling to avoid blocking the main thread
  React.useEffect(() => {
    if (timeout && onTimeout) {
      const timeoutId = window.requestIdleCallback(() => handleTimeout(), { timeout });
      return () => window.cancelIdleCallback(timeoutId);
    }
  }, [timeout, onTimeout, handleTimeout]);

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

/**
 * Custom hook for managing loading states and suspense boundaries
 */
export function useLoadingBoundary(
  options: Omit<LoadingBoundaryProps, 'children'> = {}
): UseLoadingBoundaryResult {
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = useCallback(async <T,>(promise: Promise<T>): Promise<T> => {
    const startTime = performance.now();
    setIsLoading(true);

    try {
      const result = await promise;
      const duration = performance.now() - startTime;

      // Record loading duration
      if (options.name) {
        performanceMonitor.record(
          'loading.duration',
          duration,
          'ms',
          { component: options.name }
        );
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  }, [options.name]);

  const BoundaryComponent = useCallback(
    ({ children, ...props }: LoadingBoundaryProps) => (
      <LoadingBoundary {...options} {...props}>
        {children}
      </LoadingBoundary>
    ),
    [options]
  );

  return {
    LoadingBoundary: BoundaryComponent,
    isLoading,
    setIsLoading,
    withLoading
  };
}

/**
 * HOC that wraps a component with a loading boundary
 */
export function withLoadingBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<LoadingBoundaryProps, 'children'> = {}
): React.FC<P> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const WithLoadingBoundary: React.FC<P> = (props) => {
    const { LoadingBoundary } = useLoadingBoundary({
      ...options,
      name: displayName
    });

    return (
      <LoadingBoundary>
        <WrappedComponent {...props} />
      </LoadingBoundary>
    );
  };

  WithLoadingBoundary.displayName = `WithLoadingBoundary(${displayName})`;
  return WithLoadingBoundary;
}

export { LoadingBoundary };
export type { LoadingBoundaryProps }; 