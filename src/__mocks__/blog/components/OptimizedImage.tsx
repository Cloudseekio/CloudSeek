import React from 'react';
import { cn } from '../../../__mocks__/utils/cn';

// For blog/components/OptimizedImage
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string[];
  onError?: (error: Error) => void;
  onLoad?: () => void;
  fallbackSrc?: string;
  fit?: 'cover' | 'contain' | 'fill';
}

// Mock ImageErrorBoundary component
interface ImageErrorBoundaryProps {
  children: React.ReactNode;
  fallbackUrl?: string;
  alt?: string;
  className?: string;
  onError?: (error: Error) => void;
}

const ImageErrorBoundary: React.FC<ImageErrorBoundaryProps> = ({ children }) => children;

export const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  onLoad,
  fallbackSrc,
}: OptimizedImageProps) => {
  return (
    <ImageErrorBoundary>
      <img
        src={src || fallbackSrc || '/images/placeholder.jpg'}
        alt={alt}
        width={width}
        height={height}
        className={cn('transition-opacity duration-300 opacity-100', className)}
        onLoad={() => onLoad?.()}
        data-testid="optimized-image"
      />
    </ImageErrorBoundary>
  );
};

// Define interface for the default export version
interface DefaultOptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  image?: {
    url?: string;
    alt?: string;
  };
  className?: string;
  alt?: string;
}

// Mock for the export default version
const DefaultOptimizedImage = ({ image, className = '', alt = '', ...props }: DefaultOptimizedImageProps) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={image?.url || '/images/placeholder.jpg'}
        alt={alt || image?.alt || ''}
        className="w-full h-full object-cover"
        {...props}
        data-testid="optimized-image-default"
      />
    </div>
  );
};

// Mock for additional exports
export function preloadImage(): void {
  // No-op implementation
}

export function generateSrcSet(): string {
  return '';
}

export function generateSizes(): string {
  return '100vw';
}

export function getOptimizedImageUrl(src: string): string {
  return src;
}

export function getBestSupportedFormat(): string {
  return 'webp';
}

export function preloadCriticalImages(): void {
  // No-op implementation
}

// Default export
export default DefaultOptimizedImage; 