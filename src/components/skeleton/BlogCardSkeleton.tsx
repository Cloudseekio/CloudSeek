import React from 'react';
import { cn } from '../../utils/cn';
import { SkeletonBase, SkeletonAnimationType } from './SkeletonBase';
import { SkeletonImage } from './SkeletonImage';
import { SkeletonText } from './SkeletonText';

interface BlogCardSkeletonProps {
  /**
   * Animation type or false to disable
   */
  animate?: boolean | SkeletonAnimationType;
  
  /**
   * Additional class name
   */
  className?: string;
  
  /**
   * Aspect ratio for the image
   */
  imageAspectRatio?: number;
  
  /**
   * Whether to display the category tag
   */
  showCategory?: boolean;
}

/**
 * Skeleton loader for blog cards that matches the dimensions and layout
 * of the actual BlogCard component for a smooth content transition
 */
export const BlogCardSkeleton: React.FC<BlogCardSkeletonProps> = ({
  animate = 'shimmer',
  className = '',
  imageAspectRatio = 16/9,
  showCategory = true
}) => {
  return (
    <article className={cn('blog-card relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-sm', className)}>
      {/* Category tag */}
      {showCategory && (
        <div className="absolute top-2 left-2 z-10">
          <SkeletonBase 
            animate={animate}
            className="h-6 w-24 rounded-sm"
          />
        </div>
      )}

      {/* Image container */}
      <div className="blog-card-image-container">
        <SkeletonImage
          animate={animate}
          aspectRatio={imageAspectRatio}
          className="w-full h-44 md:h-52"
          rounded="lg"
          showIcon={false}
        />
      </div>
      
      {/* Content container */}
      <div className="blog-card-content p-4">
        {/* Title */}
        <SkeletonText
          animate={animate}
          lines={2}
          fontSize="xl"
          isHeading={true}
          className="mb-2"
        />
        
        {/* Excerpt */}
        <SkeletonText
          animate={animate}
          lines={2}
          fontSize="base"
          className="mb-4"
        />
        
        {/* Author and metadata */}
        <div className="mt-4 flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center">
            <SkeletonImage
              animate={animate}
              width={32}
              height={32}
              rounded="full"
              className="mr-2"
            />
            <SkeletonText
              animate={animate}
              width={100}
              fontSize="sm"
            />
          </div>
          
          {/* Date and read time */}
          <div className="flex items-center">
            <SkeletonText
              animate={animate}
              width={80}
              fontSize="xs"
            />
          </div>
        </div>
      </div>
    </article>
  );
};