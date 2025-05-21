import React, { useEffect, useState } from 'react';
import { ImageErrorBoundary } from './error/ImageErrorBoundary';
import { cn } from '../../utils/cn';
import {
  generateSrcSet,
  generateSizes,
  getOptimizedImageUrl,
  getBestSupportedFormat,
  preloadCriticalImages
} from '../../utils/imageOptimization';

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

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  quality = 75,
  sizes: customSizes,
  onError,
  onLoad,
  fallbackSrc,
  fit = 'cover'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const format = getBestSupportedFormat();

  useEffect(() => {
    if (priority) {
      preloadCriticalImages([src]);
    }
  }, [priority, src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = (error: Error) => {
    onError?.(error);
  };

  const optimizedSrc = getOptimizedImageUrl(src, {
    quality,
    format,
    width,
    height,
    fit
  });

  const srcSet = generateSrcSet(src, { quality, format, fit });
  const sizes = generateSizes(customSizes);

  return (
    <ImageErrorBoundary
      fallbackUrl={fallbackSrc}
      alt={alt}
      className={className}
      onError={handleError}
    >
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
      />
    </ImageErrorBoundary>
  );
};

export function preloadImage(src: string): void {
  preloadCriticalImages([src]);
} 