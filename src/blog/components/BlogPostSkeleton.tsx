import React from 'react';
import { cn } from '../../utils/cn';

interface BlogPostSkeletonProps {
  featured?: boolean;
  compact?: boolean;
  className?: string;
}

const BlogPostSkeleton: React.FC<BlogPostSkeletonProps> = ({ 
  featured = false, 
  compact = false,
  className
}) => {
  return (
    <div 
      className={cn(
        'animate-pulse bg-white rounded-xl shadow-md overflow-hidden',
        featured ? 'h-[420px]' : compact ? 'h-[280px]' : 'h-[320px]',
        className
      )}
      data-testid="blog-list-item-skeleton"
      role="status"
      aria-label="Loading blog post"
    >
      {/* Image placeholder */}
      <div className="bg-gray-200 w-full h-48" />
      
      <div className="p-6 space-y-4">
        {/* Category placeholder */}
        <div className="flex space-x-2">
          <div className="w-20 h-6 bg-gray-200 rounded-full" />
          {featured && <div className="w-20 h-6 bg-gray-200 rounded-full" />}
        </div>
        
        {/* Title placeholder */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          {featured && <div className="h-4 bg-gray-200 rounded w-1/2" />}
        </div>
        
        {/* Excerpt placeholder */}
        {!compact && (
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-4/5" />
          </div>
        )}
        
        {/* Metadata placeholder */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center space-x-2">
            {/* Author avatar placeholder */}
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="w-24 h-3 bg-gray-200 rounded" />
          </div>
          <div className="w-20 h-3 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Loading blog post...</span>
    </div>
  );
};

export default BlogPostSkeleton; 