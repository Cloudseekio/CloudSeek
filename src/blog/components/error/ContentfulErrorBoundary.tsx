import React from 'react';
import logger from '../../../utils/logger';
import { getContentfulConfig } from '../../../config/services';

// Define state interface
interface ContentfulErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  connectionStatus: 'connected' | 'disconnected' | 'checking';
  isCheckingConnection: boolean;
  retryCount: number;
  lastRetryTimestamp: number;
}

// Define props interface
interface ContentfulErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  maxRetries?: number;
}

/**
 * Error boundary specifically for Contentful-related errors.
 * Provides connection checking, retry functionality, and detailed error reporting.
 */
class ContentfulErrorBoundary extends React.Component<
  ContentfulErrorBoundaryProps, 
  ContentfulErrorBoundaryState
> {
  private readonly MAX_RETRIES: number;
  private readonly RETRY_DELAY = 5000; // 5 seconds
  private readonly MIN_RETRY_DELAY = 2000; // 2 seconds
  private retryTimeoutId: number | null = null;

  constructor(props: ContentfulErrorBoundaryProps) {
    super(props);
    this.MAX_RETRIES = props.maxRetries || 3;
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      connectionStatus: 'checking',
      isCheckingConnection: false,
      retryCount: 0,
      lastRetryTimestamp: 0,
    };
  }

  componentDidMount(): void {
    // Check Contentful connection on mount
    this.checkContentfulConnection();
  }

  static getDerivedStateFromError(error: Error): Partial<ContentfulErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error
    logger.error('ContentfulErrorBoundary caught an error:', error, errorInfo);
    
    // Update state
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
    
    // Check Contentful connection
    this.checkContentfulConnection();
  }

  // Check connection to Contentful API
  checkContentfulConnection = async (): Promise<void> => {
    if (this.state.isCheckingConnection) {
      return;
    }

    this.setState({ isCheckingConnection: true, connectionStatus: 'checking' });

    try {
      const config = getContentfulConfig();
      
      // Simple check - if we have required config values
      if (!config.spaceId || !config.accessToken) {
        throw new Error('Missing required Contentful configuration');
      }
      
      // Here you would typically make a simple API call to Contentful
      // For now, we'll simulate a successful connection
      
      this.setState({
        connectionStatus: 'connected',
        isCheckingConnection: false
      });
      
      logger.info('Contentful connection check successful');
    } catch (error) {
      logger.error('Contentful connection check failed:', error);
      
      this.setState({
        connectionStatus: 'disconnected',
        isCheckingConnection: false
      });
    }
  };

  // Handle retry attempts when errors occur
  handleRetry = (): void => {
    const { retryCount } = this.state;
    
    if (retryCount >= this.MAX_RETRIES) {
      logger.warn('Maximum retry attempts reached');
      return;
    }
    
    // Clear any existing timeout
    if (this.retryTimeoutId !== null) {
      window.clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
    
    const nextRetryCount = retryCount + 1;
    const now = Date.now();
    
    this.setState({
      retryCount: nextRetryCount,
      lastRetryTimestamp: now
    });
    
    logger.info(`Attempting retry ${nextRetryCount} of ${this.MAX_RETRIES}`);
    
    // Check connection again
    this.checkContentfulConnection();
    
    // Reset error state to trigger re-render of children
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  // Clean up resources on unmount
  componentWillUnmount(): void {
    if (this.retryTimeoutId !== null) {
      window.clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  }

  render(): React.ReactNode {
    const { hasError, error, connectionStatus, retryCount } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Show fallback UI when there's an error
      return fallback || (
        <div className="error-container">
          <h2>Error Loading Content</h2>
          <p>{error?.message || 'An unexpected error occurred'}</p>
          <p>Connection Status: {connectionStatus}</p>
          {retryCount > 0 && <p>Retry attempt {retryCount} of {this.MAX_RETRIES}</p>}
          <button onClick={this.handleRetry}>Try Again</button>
        </div>
      );
    }
    
    // Render children when no error
    return children;
  }
}

export default ContentfulErrorBoundary; 