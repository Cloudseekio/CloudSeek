import React from 'react';
import { Search } from 'lucide-react';

interface BlogEmptyStateProps {
  message?: string;
  searchQuery?: string;
  onResetSearch?: () => void;
}

const BlogEmptyState: React.FC<BlogEmptyStateProps> = ({
  message = 'No articles found',
  searchQuery,
  onResetSearch
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-8 text-center">
      <Search size={48} className="mx-auto text-gray-300 mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">{message}</h3>
      
      {searchQuery && (
        <>
          <p className="text-gray-600 mb-4">
            No articles match "<span className="font-medium">{searchQuery}</span>"
          </p>
          {onResetSearch && (
            <button 
              onClick={onResetSearch}
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Clear search and show all articles
            </button>
          )}
        </>
      )}
      
      {!searchQuery && (
        <p className="text-gray-600">
          Check back later for new content or try a different search.
        </p>
      )}
    </div>
  );
};

export default BlogEmptyState; 