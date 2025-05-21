import React from 'react';
import { SkeletonText } from '../../components/skeleton';
import { cn } from '../../utils/cn';

interface BlogHeaderSkeletonProps {
  showSearch?: boolean;
  showFilters?: boolean;
  className?: string;
}

export const BlogHeaderSkeleton: React.FC<BlogHeaderSkeletonProps> = ({
  showSearch = true,
  showFilters = true,
  className
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Title and description */}
      <div className="space-y-4">
        <div data-testid="blog-header-title-skeleton">
          <SkeletonText width={300} fontSize="2xl" className="mx-auto" />
        </div>
        <div data-testid="blog-header-meta-skeleton">
          <SkeletonText 
            width="70%" 
            lines={2} 
            fontSize="base" 
            className="mx-auto text-center" 
          />
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="max-w-2xl mx-auto" data-testid="blog-header-search-skeleton">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div data-testid="blog-header-filters-skeleton">
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Categories */}
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`cat-${index}`}
                  className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"
                />
              ))}
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-200" />

            {/* Tags */}
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`tag-${index}`}
                  className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Optional metadata */}
      <div className="flex justify-center gap-4">
        <SkeletonText width={100} fontSize="sm" />
        <SkeletonText width={100} fontSize="sm" />
      </div>
    </div>
  );
};

export default BlogHeaderSkeleton; 