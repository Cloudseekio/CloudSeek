import React from 'react';
import { cn } from '../../utils/cn';

export type SkeletonAnimationType = 'pulse' | 'shimmer' | 'wave' | 'none';

export interface SkeletonBaseProps {
  /**
   * Whether to animate the skeleton
   */
  animate?: boolean | SkeletonAnimationType;
  
  /**
   * Additional class names
   */
  className?: string;
  
  /**
   * Children content
   */
  children?: React.ReactNode;
}

/**
 * Base component that applies skeleton animations and styles
 * Used internally by other skeleton components
 */
export const SkeletonBase: React.FC<SkeletonBaseProps> = ({
  animate = 'pulse',
  className,
  children
}) => {
  // Determine which animation class to use
  const getAnimationClass = () => {
    if (animate === false || animate === 'none') return '';
    
    if (typeof animate === 'boolean' && animate) {
      return 'animate-pulse';
    }
    
    switch (animate) {
      case 'pulse':
        return 'animate-pulse';
      case 'shimmer':
        return 'skeleton-shimmer';
      case 'wave':
        return 'skeleton-wave';
      default:
        return 'animate-pulse';
    }
  };
  
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cn(
        'skeleton-base bg-gray-200 dark:bg-gray-700',
        getAnimationClass(),
        className
      )}
    >
      {children}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// CSS to be added to global stylesheet
/*
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes wave {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.skeleton-shimmer {
  background: linear-gradient(to right, #e5e7eb 8%, #f3f4f6 18%, #e5e7eb 33%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-wave {
  animation: wave 1.5s ease infinite;
}

@media (prefers-reduced-motion) {
  .skeleton-shimmer,
  .skeleton-wave,
  .animate-pulse {
    animation: none;
  }
}
*/ 