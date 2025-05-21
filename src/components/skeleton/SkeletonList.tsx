import React from 'react';
import { cn } from '../../utils/cn';
import { SkeletonBase, SkeletonAnimationType } from './SkeletonBase';

export interface SkeletonListProps {
  /**
   * Number of items to display
   */
  count?: number;
  
  /**
   * Spacing between items
   */
  gap?: number;
  
  /**
   * Layout direction
   */
  layout?: 'vertical' | 'grid';
  
  /**
   * Number of columns for grid layout
   */
  columns?: 1 | 2 | 3 | 4;
  
  /**
   * Additional class name for container
   */
  className?: string;
  
  /**
   * Additional class name for individual items
   */
  itemClassName?: string;
  
  /**
   * Custom render function for each item
   */
  renderItem?: (index: number) => React.ReactNode;
  
  /**
   * Animation type or false to disable
   */
  animate?: boolean | SkeletonAnimationType;
  
  /**
   * Item height
   */
  itemHeight?: number | string;
  
  /**
   * Custom aria label for better accessibility
   */
  ariaLabel?: string;
}

/**
 * Renders a list of skeleton loading placeholders
 * Useful for lists, grids, and repeated content patterns
 */
export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 3,
  gap = 4,
  layout = 'vertical',
  columns = 1,
  className = '',
  itemClassName = '',
  renderItem,
  animate = 'shimmer',
  itemHeight = '6rem',
  ariaLabel = 'Loading list items'
}) => {
  const items = Array.from({ length: count }, (_, index) => index);

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={ariaLabel}
      className={cn(
        layout === 'grid' 
          ? `grid ${gridCols[columns]} gap-${gap}` 
          : `flex flex-col gap-${gap}`,
        className
      )}
    >
      {items.map((index) => (
        <div key={index} className="w-full">
          {renderItem ? renderItem(index) : (
            <SkeletonBase
              animate={animate}
              className={cn(
                'w-full rounded-md',
                itemClassName
              )}
              style={{
                height: typeof itemHeight === 'number' ? `${itemHeight}px` : itemHeight
              }}
            />
          )}
        </div>
      ))}
      <span className="sr-only">{ariaLabel}...</span>
    </div>
  );
}; 