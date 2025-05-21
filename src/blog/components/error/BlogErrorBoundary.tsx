import React from 'react';
import logger from '../../../utils/logger';
import { getBlogService } from '../../services/serviceFactory';

interface BlogErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
  lastRetryTimestamp: number;
  isRetrying: boolean;
}

interface BlogErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  maxRetries?: number;
  retryDelay?: number;
}

class BlogErrorBoundary extends React.Component<BlogErrorBoundaryProps, BlogErrorBoundaryState> {
  private readonly MAX_RETRIES: number;
  private readonly INITIAL_RETRY_DELAY: number;
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: BlogErrorBoundaryProps) {
    super(props);
    this.MAX_RETRIES = props.maxRetries || 3;
    this.INITIAL_RETRY_DELAY = props.retryDelay || 2000;
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      lastRetryTimestamp: 0,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<BlogErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('BlogErrorBoundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    this.setState({
      hasError: true,
      error,
      errorInfo
    });
  }

  private getRetryDelay(): number {
    // Exponential backoff: 2s, 4s, 8s, etc.
    return this.INITIAL_RETRY_DELAY * Math.pow(2, this.state.retryCount);
  }

  private getErrorMessage(): string {
    const { error } = this.state;
    if (!error) return 'An unknown error occurred';

    // Handle specific error types
    if (error.message.includes('hooks')) {
      return 'An internal error occurred. Please refresh the page.';
    }
    if (error.message.includes('Network')) {
      return 'Unable to connect to the blog service. Please check your internet connection.';
    }
    if (error.message.includes('timeout')) {
      return 'The request took too long to complete. Please try again.';
    }
    if (error.message.includes('404')) {
      return 'The requested blog content could not be found.';
    }
    if (error.message.includes('403')) {
      return 'You don\'t have permission to access this content.';
    }

    return error.message;
  }

  private async handleRetry(): Promise<void> {
    const { retryCount } = this.state;
    
    if (retryCount >= this.MAX_RETRIES) {
      logger.warn('Maximum retry attempts reached');
      return;
    }

    // Clear any existing timeout
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.setState({ isRetrying: true });

    try {
      // Reset error state first
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
        lastRetryTimestamp: Date.now()
      });

      // Verify blog service connection
      const blogService = getBlogService();
      await blogService.getConnectionStatus();

      logger.info(`Successfully recovered from error (Attempt ${retryCount + 1})`);
    } catch (error) {
      logger.error('Retry attempt failed:', error);
      
      const retryDelay = this.getRetryDelay();
      logger.info(`Scheduling next retry in ${retryDelay}ms`);

      // Schedule next retry
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry();
      }, retryDelay);

      // Update error state
      this.setState({
        hasError: true,
        error: error instanceof Error ? error : new Error('Retry failed'),
        isRetrying: false
      });
    } finally {
      this.setState({ isRetrying: false });
    }
  }

  componentWillUnmount(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render(): React.ReactNode {
    const { hasError, retryCount, isRetrying } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      return fallback || (
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
              Error Loading Blog Content
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {this.getErrorMessage()}
            </p>
          </div>

          {retryCount > 0 && (
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Retry attempt {retryCount} of {this.MAX_RETRIES}
            </p>
          )}

          <button
            onClick={() => this.handleRetry()}
            disabled={isRetrying || retryCount >= this.MAX_RETRIES}
            className={`
              rounded bg-blue-600 px-4 py-2 text-white transition-colors
              ${isRetrying ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700'}
              ${retryCount >= this.MAX_RETRIES ? 'cursor-not-allowed opacity-50' : ''}
            `}
          >
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </button>

          {retryCount >= this.MAX_RETRIES && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Maximum retry attempts reached. Please refresh the page or try again later.
            </p>
          )}
        </div>
      );
    }

    return children;
  }
}

export default BlogErrorBoundary; 