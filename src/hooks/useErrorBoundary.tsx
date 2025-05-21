import React, { Component, useCallback, useState } from 'react';
import logger from '../utils/logger';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary component that catches errors in its children
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error
    logger.error('Error caught by boundary:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // Update state
    this.setState({ errorInfo });

    // Call error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ error: null, errorInfo: null });
    this.props.onReset?.();
  };

  render(): React.ReactNode {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (fallback) {
        return fallback;
      }

      return (
        <div role="alert" className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={this.handleReset}>Try again</button>
        </div>
      );
    }

    return children;
  }
}

interface UseErrorBoundaryResult {
  ErrorBoundary: typeof ErrorBoundary;
  error: Error | null;
  resetError: () => void;
}

/**
 * Custom hook for using error boundaries in functional components
 */
export function useErrorBoundary(
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
): UseErrorBoundaryResult {
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    setError(error);
    onError?.(error, errorInfo);
  }, [onError]);

  const BoundaryComponent = useCallback(
    ({ children, fallback }: Omit<ErrorBoundaryProps, 'onError' | 'onReset'>) => (
      <ErrorBoundary
        onError={handleError}
        onReset={resetError}
        fallback={fallback}
      >
        {children}
      </ErrorBoundary>
    ),
    [handleError, resetError]
  );

  return {
    ErrorBoundary: BoundaryComponent,
    error,
    resetError
  };
}

export { ErrorBoundary };
export type { ErrorBoundaryProps }; 