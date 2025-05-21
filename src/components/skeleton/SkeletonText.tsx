import React from 'react';
import { cn } from '../../utils/cn';
import { SkeletonBase, SkeletonAnimationType } from './SkeletonBase';

interface SkeletonTextProps {
  /**
   * Number of lines to display
   */
  lines?: number;
  
  /**
   * Width of each line (can vary by line)
   */
  width?: string | number | Array<string | number>;
  
  /**
   * Additional class name for container
   */
  className?: string;
  
  /**
   * Animation type or false to disable
   */
  animate?: boolean | SkeletonAnimationType;
  
  /**
   * Font size for lines
   */
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  
  /**
   * Heading style (adds larger height and bottom margin)
   */
  isHeading?: boolean;
  
  /**
   * Spacing between lines
   */
  spacing?: 'tight' | 'normal' | 'relaxed';
  
  /**
   * Custom aria label for better accessibility
   */
  ariaLabel?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  width = '100%',
  className = '',
  animate = true,
  fontSize = 'base',
  isHeading = false,
  spacing = 'normal',
  ariaLabel = 'Loading text content'
}) => {
  const fontSizeClasses = {
    xs: 'h-3',
    sm: 'h-4',
    base: 'h-5',
    lg: 'h-6',
    xl: 'h-7',
    '2xl': 'h-8',
    '3xl': 'h-10'
  };
  
  const spacingClasses = {
    tight: 'space-y-1',
    normal: 'space-y-2',
    relaxed: 'space-y-3'
  };

  // Handle different width scenarios (single value or array of values)
  const getLineWidth = (index: number) => {
    if (Array.isArray(width)) {
      return width[index % width.length];
    }
    
    // Make last line shorter for multi-line text blocks that aren't headings
    if (!isHeading && lines > 1 && index === lines - 1) {
      return typeof width === 'number' ? width * 0.8 : '80%';
    }
    
    return width;
  };
  
  return (
    <div
      aria-label={ariaLabel}
      data-testid="skeleton-text"
      className={cn(
        'w-full',
        spacingClasses[spacing],
        className
      )}
    >
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBase
          key={index}
          animate={animate}
          className={cn(
            'rounded',
            fontSizeClasses[fontSize],
            isHeading && index === 0 && 'mb-4',
            // Add specific styles for headings
            isHeading && index === 0 && fontSize === 'base' && 'h-6',
            isHeading && index === 0 && fontSize === 'lg' && 'h-7',
            isHeading && index === 0 && fontSize === 'xl' && 'h-8',
            isHeading && index === 0 && fontSize === '2xl' && 'h-9',
            isHeading && index === 0 && fontSize === '3xl' && 'h-12'
          )}
          style={{ 
            width: typeof getLineWidth(index) === 'number' 
              ? `${getLineWidth(index)}px` 
              : getLineWidth(index) 
          }}
          data-testid={`skeleton-text-line-${index}`}
        />
      ))}
    </div>
  );
}; 