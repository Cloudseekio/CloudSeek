import React, { forwardRef } from 'react';
import './SkeletonLoader.css'; // We'll create this next

export interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width of the skeleton (in px, % or any valid CSS unit) */
  width?: string | number;
  /** Height of the skeleton (in px, % or any valid CSS unit) */
  height?: string | number;
  /** Shape of the skeleton (rectangle or circle) */
  variant?: 'text' | 'rectangular' | 'circular';
  /** Whether the skeleton should have a pulsing animation */
  animation?: 'pulse' | 'wave' | 'none';
  /** Whether to show the skeleton or render children */
  loading?: boolean;
  /** Number of rows to display (for text variant) */
  rows?: number;
  /** Optional className */
  className?: string;
}

/**
 * SkeletonLoader Component
 * 
 * Displays an animated placeholder while content is loading.
 * Can be customized for different shapes and sizes.
 * 
 * @example
 * // Basic usage
 * <SkeletonLoader height={200} width="100%" />
 * 
 * // Text placeholder with multiple lines
 * <SkeletonLoader variant="text" rows={3} />
 * 
 * // Avatar placeholder
 * <SkeletonLoader variant="circular" width={40} height={40} />
 * 
 * // Conditionally showing content
 * <SkeletonLoader loading={isLoading} width="100%">
 *   <div>Actual content</div>
 * </SkeletonLoader>
 */
export const SkeletonLoader = forwardRef<HTMLDivElement, SkeletonLoaderProps>(
  ({
    width,
    height,
    variant = 'rectangular',
    animation = 'pulse',
    loading = true,
    rows = 1,
    className = '',
    children,
    style,
    ...otherProps
  }, ref) => {
    // If not loading and children are provided, render children
    if (!loading && children) {
      return <>{children}</>;
    }

    // Generate style with width and height
    const skeletonStyle: React.CSSProperties = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      ...style,
    };

    // Generate class name based on props
    const skeletonClasses = [
      'skeleton-loader',
      `skeleton-${variant}`,
      animation !== 'none' && `skeleton-animation-${animation}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // For text variant with multiple rows
    if (variant === 'text' && rows > 1) {
      return (
        <div
          ref={ref}
          className="skeleton-text-container"
          {...otherProps}
        >
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className={skeletonClasses}
              style={{
                ...skeletonStyle,
                width: index === rows - 1 && typeof width !== 'undefined'
                  ? `calc(${typeof width === 'number' ? `${width}px` : width} * 0.8)`
                  : width,
                marginBottom: index === rows - 1 ? 0 : '0.5rem',
              }}
            />
          ))}
        </div>
      );
    }

    // For single skeleton element
    return (
      <div
        ref={ref}
        className={skeletonClasses}
        style={skeletonStyle}
        {...otherProps}
      />
    );
  }
);

SkeletonLoader.displayName = 'SkeletonLoader';

export default SkeletonLoader; 