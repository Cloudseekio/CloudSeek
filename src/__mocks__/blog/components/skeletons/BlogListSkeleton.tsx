import React from 'react';

interface BlogListSkeletonProps {
  count?: number;
  columns?: number;
  className?: string;
}

const BlogListSkeleton: React.FC<BlogListSkeletonProps> = ({
  count = 3,
  columns = 3,
  className = ''
}) => {
  return (
    <div 
      className={`blog-list-skeleton ${className}`}
      data-testid="blog-list-skeleton"
      role="status"
      aria-busy="true"
    >
      <div className={`grid grid-cols-${columns} gap-4`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-40 rounded mb-4"></div>
            <div className="bg-gray-200 h-6 w-24 rounded mb-2"></div>
            <div className="bg-gray-200 h-8 w-3/4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 w-full rounded mb-4"></div>
            <div className="flex justify-between">
              <div className="bg-gray-200 h-4 w-20 rounded"></div>
              <div className="bg-gray-200 h-4 w-20 rounded"></div>
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading blog posts...</span>
    </div>
  );
};

export default BlogListSkeleton; 