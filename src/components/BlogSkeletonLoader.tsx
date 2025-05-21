import React from 'react';

interface BlogSkeletonLoaderProps {
  count?: number;
  type?: 'card' | 'detail';
}

const BlogSkeletonLoader: React.FC<BlogSkeletonLoaderProps> = ({ 
  count = 3, 
  type = 'card' 
}) => {
  const renderCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      <div className="bg-gray-200 h-48 w-full"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-2/4 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  const renderDetailSkeleton = () => (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-2/4 mb-6"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
      
      <div className="h-96 bg-gray-200 rounded w-full mb-8"></div>
      
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-4/5"></div>
        <div className="h-6 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );

  if (type === 'detail') {
    return renderDetailSkeleton();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderCardSkeleton()}</div>
      ))}
    </div>
  );
};

export default BlogSkeletonLoader; 