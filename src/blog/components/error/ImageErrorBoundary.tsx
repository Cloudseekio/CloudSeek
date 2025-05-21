import React from 'react';
import { ImageOff } from 'lucide-react';
import logger from '../../../utils/logger';

interface ImageErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ImageErrorBoundaryProps {
  children: React.ReactNode;
  fallbackUrl?: string;
  alt?: string;
  className?: string;
  onError?: (error: Error) => void;
}

export class ImageErrorBoundary extends React.Component<ImageErrorBoundaryProps, ImageErrorBoundaryState> {
  constructor(props: ImageErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ImageErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('Image failed to load:', {
      error: error.message,
      componentStack: errorInfo.componentStack,
      fallbackUrl: this.props.fallbackUrl
    });

    this.props.onError?.(error);
  }

  render(): React.ReactNode {
    const { hasError } = this.state;
    const { children, fallbackUrl, alt, className } = this.props;

    if (hasError) {
      if (fallbackUrl) {
        return (
          <img
            src={fallbackUrl}
            alt={alt || 'Fallback image'}
            className={className}
            loading="lazy"
          />
        );
      }

      return (
        <div
          className={`flex items-center justify-center bg-gray-100 ${className}`}
          role="img"
          aria-label={alt || 'Failed to load image'}
        >
          <ImageOff className="w-8 h-8 text-gray-400" />
        </div>
      );
    }

    return children;
  }
} 