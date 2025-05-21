import React from 'react';

const FiltersSkeleton: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4 items-center animate-pulse">
      {/* Categories skeleton */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={`cat-${i}`}
            className="h-8 w-24 bg-gray-200 rounded-full"
          />
        ))}
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200" />

      {/* Tags skeleton */}
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={`tag-${i}`}
            className="h-8 w-20 bg-gray-200 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default FiltersSkeleton; 