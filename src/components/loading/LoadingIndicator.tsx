import React, { forwardRef } from 'react';
import './LoadingIndicator.css';

export type LoadingIndicatorSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LoadingIndicatorVariant = 'spinner' | 'dots' | 'pulse' | 'bar' | 'circular';
export type LoadingIndicatorColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'custom';

export interface LoadingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size of the loading indicator */
  size?: LoadingIndicatorSize;
  /** Animation style variant */
  variant?: LoadingIndicatorVariant;
  /** Color theme */
  color?: LoadingIndicatorColor;
  /** Text to display alongside the indicator */
  label?: string;
  /** Whether to center the indicator in its container */
  centered?: boolean;
  /** Whether the loading indicator is visible */
  loading?: boolean;
  /** Custom color (when color="custom") */
  customColor?: string;
  /** Custom stroke width for spinner variants */
  strokeWidth?: number;
  /** Speed of the animation (1 is normal) */
  speed?: number;
}

/**
 * LoadingIndicator Component
 * 
 * Displays various loading animation styles to indicate content
 * or operations in progress.
 * 
 * @example
 * // Basic spinner
 * <LoadingIndicator />
 * 
 * // Dots animation
 * <LoadingIndicator variant="dots" size="lg" color="primary" />
 * 
 * // With loading text
 * <LoadingIndicator label="Loading data..." centered />
 * 
 * // Custom styling
 * <LoadingIndicator 
 *   variant="circular" 
 *   color="custom" 
 *   customColor="#8A2BE2" 
 *   size="xl" 
 * />
 */
export const LoadingIndicator = forwardRef<HTMLDivElement, LoadingIndicatorProps>(
  ({
    size = 'md',
    variant = 'spinner',
    color = 'primary',
    label,
    centered = false,
    loading = true,
    customColor,
    strokeWidth,
    speed = 1,
    className = '',
    style,
    ...otherProps
  }, ref) => {
    if (!loading) {
      return null;
    }

    const containerClasses = [
      'loading-indicator-container',
      centered && 'loading-indicator-centered',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const indicatorClasses = [
      'loading-indicator',
      `loading-indicator-${variant}`,
      `loading-indicator-${size}`,
      `loading-indicator-${color}`,
    ]
      .filter(Boolean)
      .join(' ');

    // Compute custom styles
    const indicatorStyle: React.CSSProperties = {
      ...style,
      '--animation-speed': `${1 / speed}s`,
      ...(customColor && color === 'custom' ? { '--custom-color': customColor } : {}),
      ...(strokeWidth ? { '--stroke-width': `${strokeWidth}px` } : {}),
    } as React.CSSProperties;

    // Create indicator based on variant
    const renderIndicator = () => {
      switch (variant) {
        case 'spinner':
          return (
            <div className={indicatorClasses} style={indicatorStyle}>
              <svg viewBox="0 0 50 50" className="loading-indicator-svg">
                <circle 
                  cx="25" 
                  cy="25" 
                  r="20" 
                  fill="none" 
                  className="loading-indicator-circle" 
                />
              </svg>
            </div>
          );
        
        case 'dots':
          return (
            <div className={indicatorClasses} style={indicatorStyle}>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          );
        
        case 'pulse':
          return (
            <div className={indicatorClasses} style={indicatorStyle}>
              <div className="loading-pulse"></div>
            </div>
          );
        
        case 'bar':
          return (
            <div className={indicatorClasses} style={indicatorStyle}>
              <div className="loading-bar-track">
                <div className="loading-bar-progress"></div>
              </div>
            </div>
          );
        
        case 'circular':
          return (
            <div className={indicatorClasses} style={indicatorStyle}>
              <svg viewBox="0 0 50 50" className="loading-indicator-svg">
                <circle 
                  cx="25" 
                  cy="25" 
                  r="20" 
                  fill="none" 
                  className="loading-indicator-circle-bg" 
                />
                <circle 
                  cx="25" 
                  cy="25" 
                  r="20" 
                  fill="none" 
                  className="loading-indicator-circle" 
                />
              </svg>
            </div>
          );
        
        default:
          return <div className={indicatorClasses} style={indicatorStyle} />;
      }
    };

    return (
      <div 
        ref={ref} 
        className={containerClasses} 
        {...otherProps}
      >
        {renderIndicator()}
        {label && <div className="loading-indicator-label">{label}</div>}
      </div>
    );
  }
);

LoadingIndicator.displayName = 'LoadingIndicator';

export default LoadingIndicator; 