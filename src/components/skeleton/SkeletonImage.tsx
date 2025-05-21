import React from 'react';
import { cn } from '../../utils/cn';
import { SkeletonBase, SkeletonAnimationType } from './SkeletonBase';
import { ImageOff } from 'lucide-react';

type RoundedValue = boolean | 'sm' | 'md' | 'lg' | 'full';

interface SkeletonImageProps {
  /**
   * Width of the image (px or % or other CSS units)
   */
  width?: number | string;
  
  /**
   * Height of the image (px or % or other CSS units)
   */
  height?: number | string;
  
  /**
   * Aspect ratio (width/height) to maintain responsive ratio
   */
  aspectRatio?: number;
  
  /**
   * Border radius styling
   */
  rounded?: RoundedValue;
  
  /**
   * Additional class name
   */
  className?: string;
  
  /**
   * Animation type or false to disable
   */
  animate?: boolean | SkeletonAnimationType;
  
  /**
   * Whether to show placeholder icon
   */
  showIcon?: boolean;
  
  /**
   * Custom element type (div, span, etc.)
   */
  as?: React.ElementType;
  
  /**
   * Custom aria label for better accessibility
   */
  ariaLabel?: string;
  
  /**
   * Optional overlay color
   */
  overlayColor?: string;
  
  /**
   * Whether to apply hover effect
   */
  withHoverEffect?: boolean;
}

export const SkeletonImage: React.FC<SkeletonImageProps> = ({
  width = '100%',
  height,
  aspectRatio,
  rounded = 'md',
  className = '',
  animate = true,
  showIcon = true,
  as: Component = 'div',
  ariaLabel = 'Loading image',
  overlayColor,
  withHoverEffect = false
}) => {
  const roundedClasses: Record<string, string> = {
    'true': 'rounded-md',
    'false': '',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'full': 'rounded-full'
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
    ...overlayColor ? { backgroundColor: overlayColor } : {}
  };

  return (
    <SkeletonBase
      animate={animate}
      className={cn(
        'relative overflow-hidden',
        roundedClasses[String(rounded)],
        withHoverEffect && 'transition-transform duration-200 hover:scale-[1.02]',
        className
      )}
      style={style}
    >
      {showIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageOff 
            className="w-6 h-6 text-gray-400 dark:text-gray-500 opacity-75" 
            aria-hidden="true"
          />
        </div>
      )}
    </SkeletonBase>
  );
}; 