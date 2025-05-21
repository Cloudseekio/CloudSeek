import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { cn } from '../../utils/cn';

type BaseImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError'>;

export interface ProgressiveImageProps extends BaseImageProps {
  // Main high-quality image URL
  src: string;
  // Low-resolution placeholder image URL or base64 blur data
  placeholderSrc: string;
  // Optional blur amount (in pixels)
  blurAmount?: number;
  // Optional loading delay (in ms) to prevent flash on fast connections
  loadingDelay?: number;
  // Optional callback when the main image loads
  onLoad?: () => void;
  // Optional callback when the main image fails to load
  onError?: (error: Error) => void;
  // Optional wrapper className
  wrapperClassName?: string;
}

export const ProgressiveImage = forwardRef<HTMLImageElement, ProgressiveImageProps>(({
  src,
  placeholderSrc,
  blurAmount = 20,
  loadingDelay = 0,
  alt = '',
  onLoad,
  onError,
  className,
  wrapperClassName,
  ...props
}, ref) => {
  // State for tracking image loading
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc);

  // Ref for cleanup
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load the main image
  useEffect(() => {
    const image = new Image();
    let isMounted = true;

    const loadImage = () => {
      // Reset state
      setError(null);
      setIsLoading(true);

      // Optional loading delay
      if (loadingDelay > 0) {
        loadingTimeoutRef.current = setTimeout(() => {
          if (isMounted) {
            setCurrentSrc(src);
          }
        }, loadingDelay);
      } else {
        setCurrentSrc(src);
      }

      // Load the main image
      image.src = src;

      image.onload = () => {
        if (isMounted) {
          setIsLoading(false);
          onLoad?.();
        }
      };

      image.onerror = () => {
        if (isMounted) {
          const error = new Error(`Failed to load image: ${src}`);
          setError(error);
          setIsLoading(false);
          onError?.(error);
        }
      };
    };

    loadImage();

    // Cleanup
    return () => {
      isMounted = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      image.onload = null;
      image.onerror = null;
    };
  }, [src, loadingDelay, onLoad, onError]);

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        error ? 'bg-gray-200' : 'bg-transparent',
        wrapperClassName
      )}
      style={{ aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : undefined }}
    >
      {/* Main image */}
      <img
        {...props}
        ref={ref}
        src={currentSrc}
        alt={alt}
        className={cn(
          'transition-[filter,opacity] duration-300 ease-in-out',
          isLoading ? 'blur-sm' : 'blur-0',
          error ? 'opacity-0' : 'opacity-100',
          className
        )}
        style={{
          ...props.style,
          filter: isLoading ? `blur(${blurAmount}px)` : undefined,
        }}
        onError={() => {
          const error = new Error(`Failed to load image: ${src}`);
          setError(error);
          setIsLoading(false);
          onError?.(error);
        }}
      />

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-center p-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
}); 