import React from 'react';
import { ErrorMessage } from '../../blog/components/error/ErrorMessage';
import { LoadingOverlay } from '../loading/LoadingOverlay';
import { isRetryableError } from '../../utils/errorUtils';
import logger from '../../utils/logger';

interface AsyncErrorBoundaryState {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
  isRetrying: boolean;
}

interface AsyncErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  maxRetries?: number;
  retryDelay?: number;
  loadingFallback?: React.ReactNode;
  resetKeys?: Array<string | number | boolean>;
}

export class AsyncErrorBoundary extends React.Component<AsyncErrorBoundaryProps, AsyncErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: AsyncErrorBoundaryProps) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<AsyncErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const { onError } = this.props;
    
    logger.error('AsyncErrorBoundary caught an error:', {
      error: error.message,
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount
    });

    this.setState({ errorInfo });
    onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: AsyncErrorBoundaryProps): void {
    if (this.state.error && this.props.resetKeys) {
      // Check if any reset keys have changed
      if (this.props.resetKeys.some((key, i) => key !== prevProps.resetKeys?.[i])) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private getRetryDelay(): number {
    const { retryDelay = 1000 } = this.props;
    const { retryCount } = this.state;
    // Exponential backoff
    return retryDelay * Math.pow(2, retryCount);
  }

  private async handleRetry(): Promise<void> {
    const { maxRetries = 3 } = this.props;
    const { retryCount, error } = this.state;

    if (!error || !isRetryableError(error) || retryCount >= maxRetries) {
      logger.warn('Retry not possible:', {
        error: error?.message,
        retryCount,
        maxRetries,
        isRetryable: error ? isRetryableError(error) : false
      });
      return;
    }

    this.setState({ isRetrying: true });

    try {
      await new Promise(resolve => {
        this.retryTimeoutId = setTimeout(resolve, this.getRetryDelay());
      });

      this.setState(prevState => ({
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
        isRetrying: false
      }));

      this.props.onReset?.();
    } catch (retryError) {
      this.setState({
        error: retryError as Error,
        isRetrying: false
      });
    }
  }

  private resetErrorBoundary = (): void => {
    this.setState({
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false
    });
    this.props.onReset?.();
  };

  render(): React.ReactNode {
    const { children, fallback, loadingFallback } = this.props;
    const { error, isRetrying } = this.state;

    if (isRetrying) {
      return loadingFallback || <LoadingOverlay fullScreen showMessage />;
    }

    if (error) {
      if (fallback) {
        return fallback;
      }

      return (
        <ErrorMessage
          title="An error occurred"
          message={error.message}
          severity="error"
          onRetry={() => this.handleRetry()}
          retryCount={this.state.retryCount}
          maxRetries={this.props.maxRetries}
        />
      );
    }

    return children;
  }
} 