import React from 'react';
import { SkeletonList } from '../../components/skeleton';
import BlogPostSkeleton from './BlogPostSkeleton';
import { cn } from '../../utils/cn';

interface BlogListSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  showFeatured?: boolean;
  className?: string;
}

export const BlogListSkeleton: React.FC<BlogListSkeletonProps> = ({
  count = 6,
  columns = 3,
  showFeatured = false,
  className
}) => {
  return (
    <div 
      className={cn('space-y-8', className)}
      data-testid="blog-list-skeleton"
      role="status"
      aria-busy="true"
      aria-label="Loading blog posts"
    >
      {/* Featured post skeleton */}
      {showFeatured && (
        <div className="mb-12" data-testid="featured-post-skeleton">
          <BlogPostSkeleton featured />
        </div>
      )}

      {/* Grid of regular post skeletons */}
      <SkeletonList
        count={count}
        columns={columns}
        layout="grid"
        gap={6}
        renderItem={() => (
          <BlogPostSkeleton compact />
        )}
      />
    </div>
  );
};

export default BlogListSkeleton; 