import React from 'react';
import { SkeletonText, SkeletonList } from '../../components/skeleton';
import { cn } from '../../utils/cn';

interface BlogSidebarSkeletonProps {
  className?: string;
}

export const BlogSidebarSkeleton: React.FC<BlogSidebarSkeletonProps> = ({ className }) => {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Categories section */}
      <div className="space-y-4" data-testid="categories-skeleton">
        <SkeletonText width={120} fontSize="lg" />
        <SkeletonList
          count={5}
          gap={3}
          itemClassName="h-8 rounded-full"
        />
      </div>

      {/* Tags section */}
      <div className="space-y-4" data-testid="tags-skeleton">
        <SkeletonText width={80} fontSize="lg" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-7 w-20 bg-gray-200 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Recent posts section */}
      <div className="space-y-4">
        <SkeletonText width={150} fontSize="lg" />
        <SkeletonList
          count={3}
          gap={4}
          renderItem={() => (
            <div className="space-y-2">
              <SkeletonText width="100%" fontSize="base" />
              <SkeletonText width="60%" fontSize="sm" />
            </div>
          )}
        />
      </div>

      {/* Newsletter section */}
      <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
        <SkeletonText width={180} fontSize="lg" />
        <SkeletonText width="90%" lines={2} fontSize="sm" />
        <div className="h-10 bg-gray-200 rounded animate-pulse mt-4" />
      </div>
    </div>
  );
};

export default BlogSidebarSkeleton; 