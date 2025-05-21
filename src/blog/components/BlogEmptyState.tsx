import React from 'react';
import { Search } from 'lucide-react';

interface BlogEmptyStateProps {
  searchQuery?: string;
  onResetSearch: () => void;
}

const BlogEmptyState: React.FC<BlogEmptyStateProps> = ({
  searchQuery,
  onResetSearch
}) => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <Search size={24} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {searchQuery ? 'No results found' : 'No articles yet'}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {searchQuery
          ? `We couldn't find any articles matching "${searchQuery}"`
          : 'Check back soon for new articles'}
      </p>
      {searchQuery && (
        <button
          onClick={onResetSearch}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Clear search and view all articles
        </button>
      )}
    </div>
  );
};

export default BlogEmptyState; 