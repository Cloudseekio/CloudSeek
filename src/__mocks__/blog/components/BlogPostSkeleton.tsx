import React from 'react';

interface BlogPostSkeletonProps {
  featured?: boolean;
  compact?: boolean;
  className?: string;
}

const BlogPostSkeleton: React.FC<BlogPostSkeletonProps> = ({ 
  featured = false,
  compact,
  className = ''
}) => {
  const height = featured ? 'h-52' : compact ? 'h-32' : 'h-40';

  return (
    <div 
      className={`skeleton-card ${className}`}
      data-testid="blog-post-skeleton"
      role="status"
      aria-busy="true"
    >
      <div className="animate-pulse">
        <div className={`bg-gray-200 ${height} rounded mb-4`}></div>
        <div className="bg-gray-200 h-6 w-24 rounded mb-2"></div>
        <div className="bg-gray-200 h-8 w-3/4 rounded mb-2"></div>
        {!compact && <div className="bg-gray-200 h-4 w-full rounded mb-4"></div>}
        <div className="flex justify-between">
          <div className="bg-gray-200 h-4 w-20 rounded"></div>
          <div className="bg-gray-200 h-4 w-20 rounded"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default BlogPostSkeleton; 