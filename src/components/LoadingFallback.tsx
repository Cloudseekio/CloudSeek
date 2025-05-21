import React from 'react';
import { 
  SkeletonText, 
  SkeletonImage, 
  BlogCardSkeleton,
  HeroSectionSkeleton 
} from './skeleton';

interface LoadingFallbackProps {
  /**
   * Type of loading fallback to display
   */
  type?: 'default' | 'page' | 'card' | 'blog' | 'hero';
  
  /**
   * Custom loading message
   */
  message?: string;
  
  /**
   * Animation type for skeletons
   */
  animation?: 'pulse' | 'shimmer' | 'wave' | 'none';
  
  /**
   * Number of cards to show when type is 'blog'
   */
  cardCount?: number;
}

/**
 * Provides various loading states for different parts of the application.
 * Renders appropriate skeletons based on the type prop.
 */
const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  type = 'default',
  message = 'Loading...',
  animation = 'shimmer',
  cardCount = 3
}) => {
  // Full page loading state
  if (type === 'page') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-4">
        <div className="text-center max-w-md w-full">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <SkeletonText 
            lines={1} 
            fontSize="xl" 
            className="mb-2 mx-auto"
            width="75%"
            animate={animation}
          />
          <SkeletonText 
            lines={2} 
            className="mb-8 mx-auto"
            width="60%"
            animate={animation}
          />
          <p className="text-gray-700 dark:text-gray-300 text-xl">{message}</p>
        </div>
      </div>
    );
  }
  
  // Individual card loading state
  if (type === 'card') {
    return (
      <div 
        role="status" 
        aria-busy="true" 
        className="rounded-lg shadow-sm bg-white dark:bg-gray-800 p-6 overflow-hidden"
      >
        <SkeletonText 
          lines={1} 
          isHeading={true} 
          fontSize="xl" 
          className="mb-4"
          animate={animation}
        />
        <SkeletonImage 
          className="mb-4 w-full" 
          aspectRatio={16/9}
          animate={animation}
        />
        <SkeletonText 
          lines={3} 
          className="mb-2"
          animate={animation}
        />
        <div className="flex justify-between items-center mt-4">
          <SkeletonText width="30%" animate={animation} />
          <SkeletonText width="20%" animate={animation} />
        </div>
        <span className="sr-only">{message}</span>
      </div>
    );
  }
  
  // Blog cards grid loading state
  if (type === 'blog') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: cardCount }).map((_, i) => (
          <BlogCardSkeleton key={i} animate={animation} />
        ))}
        <span className="sr-only">{message}</span>
      </div>
    );
  }
  
  // Hero section loading state
  if (type === 'hero') {
    return <HeroSectionSkeleton animate={animation} />;
  }
  
  // Default small loading indicator
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
      <p className="text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  );
};

export default LoadingFallback;