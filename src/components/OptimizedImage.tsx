import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import { cn } from '../utils/cn';
import { 
  getBestSupportedFormat, 
  generateSrcSet, 
  generateSizes, 
  getOptimizedImageUrl 
} from '../utils/imageOptimization';
import { getBlurPlaceholder } from '../utils/imageBlur';

type ImageLoadingType = 'lazy' | 'eager';

export interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> {
  /** The source URL of the image */
  src: string;
  /** Alternative text for the image (required for accessibility) */
  alt: string;
  /** Optional width of the image */
  width?: number;
  /** Optional height of the image */
  height?: number;
  /** Optional custom sizes attribute for responsive images (will use default if not provided) */
  sizes?: string[];
  /** Image quality (1-100) - defaults to 80 */
  quality?: number;
  /** Fit mode for the image - defaults to 'cover' */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Whether the image should use lazy loading (default: true) */
  lazy?: boolean;
  /** Whether to generate a blur placeholder (default: true) */
  blurUp?: boolean;
  /** Whether the image is a priority image (above the fold) */
  priority?: boolean;
  /** Extra class name for the root element */
  wrapperClassName?: string;
  /** Callback when image has loaded */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: (error: Error) => void;
}

/**
 * OptimizedImage component that:
 * 1. Converts images to WebP format when supported
 * 2. Implements responsive images with srcset for different device sizes
 * 3. Provides lazy loading for below-the-fold content
 * 4. Implements blur-up loading for better perceived performance
 */
export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  sizes,
  quality = 80,
  objectFit = 'cover',
  lazy = true,
  blurUp = true,
  priority = false,
  className,
  wrapperClassName,
  onLoad,
  onError,
  ...props
}, ref) => {
  // State for tracking image loading and blur placeholder
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [blurDataUrl, setBlurDataUrl] = useState<string | null>(null);
  
  // Get best supported format (WebP if supported, otherwise JPEG)
  const format = useMemo(() => getBestSupportedFormat(), []);
  
  // Generate optimized image URL with WebP format when supported
  const optimizedSrc = useMemo(() => getOptimizedImageUrl(src, {
    format,
    quality,
    width,
    height,
    fit: objectFit === 'cover' ? 'cover' : objectFit === 'contain' ? 'contain' : 'fill'
  }), [src, format, quality, width, height, objectFit]);
  
  // Generate srcset for responsive images
  const srcSet = useMemo(() => generateSrcSet(src, {
    format,
    quality
  }), [src, format, quality]);
  
  // Generate sizes attribute
  const sizesAttr = useMemo(() => generateSizes(sizes), [sizes]);
  
  // Determine loading attribute based on priority and lazy props
  const loadingType: ImageLoadingType = priority ? 'eager' : lazy ? 'lazy' : 'eager';
  
  // Load blur placeholder
  useEffect(() => {
    if (!blurUp || isLoaded) return;
    
    let isMounted = true;
    
    const loadBlurPlaceholder = async () => {
      try {
        const placeholder = await getBlurPlaceholder(src, { width: 40, quality: 30 });
        if (isMounted) {
          setBlurDataUrl(placeholder);
        }
      } catch (err) {
        console.error('Failed to generate blur placeholder:', err);
      }
    };
    
    loadBlurPlaceholder();
    
    return () => {
      isMounted = false;
    };
  }, [src, blurUp, isLoaded]);
  
  // Preload image if it's a priority image
  useEffect(() => {
    if (!priority) return;
    
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = optimizedSrc;
    preloadLink.imageSrcset = srcSet;
    preloadLink.imageSizes = sizesAttr;
    document.head.appendChild(preloadLink);
    
    return () => {
      document.head.removeChild(preloadLink);
    };
  }, [priority, optimizedSrc, srcSet, sizesAttr]);
  
  // Handle image load success
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };
  
  // Handle image load error
  const handleError = () => {
    const errorMessage = new Error(`Failed to load image: ${src}`);
    setError(errorMessage);
    onError?.(errorMessage);
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        wrapperClassName
      )}
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
    >
      {/* Blur placeholder */}
      {blurUp && blurDataUrl && !isLoaded && (
        <div 
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${blurDataUrl})`,
            backgroundSize: 'cover',
            filter: 'blur(20px)',
            transform: 'scale(1.2)', // Slightly larger to handle blur edges
          }} 
        />
      )}
      
      {/* Main image */}
      <img
        ref={ref}
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={sizesAttr}
        alt={alt}
        width={width}
        height={height}
        loading={loadingType}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full transition-opacity duration-500',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...props}
      />
      
      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Image failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
});

export default OptimizedImage; 