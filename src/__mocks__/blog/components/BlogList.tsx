import React, { useEffect } from 'react';
import { BlogPost } from '../../../blog/types/blog';

// Define the props interface to match what the tests expect
export interface BlogListProps {
  posts: BlogPost[];
  featuredPosts?: BlogPost[];
  isLoading?: boolean;
  emptyMessage?: string;
  columns?: 1 | 2 | 3 | 4;
  variant?: 'default' | 'compact';
  showFeaturedSlider?: boolean;
  filterOptions?: {
    categories?: { label: string; value: string }[];
    tags?: { label: string; value: string }[];
    authors?: { label: string; value: string }[];
  };
  onFilterChange?: (filters: Record<string, string | string[]>) => void;
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number, pageSize?: number) => void;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  paginationType?: 'traditional' | 'infinite';
}

const BlogList: React.FC<BlogListProps> = ({
  posts = [],
  featuredPosts = [],
  isLoading = false,
  emptyMessage = 'No posts found',
  columns = 3,
  variant = 'default',
  showFeaturedSlider = false,
  filterOptions,
  onFilterChange,
  totalItems = 0,
  currentPage = 1,
  itemsPerPage = 12,
  onPageChange,
  hasNextPage = false,
  onLoadMore,
  loadingMore = false,
  paginationType = 'traditional'
}) => {
  
  // Handle infinite scroll pagination
  useEffect(() => {
    if (paginationType === 'infinite' && hasNextPage && onLoadMore && !isLoading && !loadingMore) {
      onLoadMore();
    }
  }, [paginationType, hasNextPage, onLoadMore, isLoading, loadingMore]);

  // Traditional pagination render function - not implemented in mock
  // but included to avoid linter errors
  const renderTraditionalPagination = () => {
    if (paginationType === 'traditional' && onPageChange) {
      return (
        <div className="pagination">
          <button 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <span>{currentPage} of {Math.ceil(totalItems / itemsPerPage)}</span>
          <button 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
          >
            Next
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Featured posts slider */}
      {showFeaturedSlider && featuredPosts.length > 0 && (
        <div data-testid="featured-posts-slider">
          {featuredPosts.map((post) => (
            <div key={post.id} className="featured-post">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Filter options */}
      {filterOptions && (
        <div className="flex flex-wrap gap-4 mb-6">
          <button>Filters</button>
          <div className="filter-options">
            {filterOptions.categories?.map((cat) => (
              <div key={cat.value} className="filter-option">
                <input 
                  type="checkbox" 
                  id={cat.value} 
                  value={cat.value} 
                  role="checkbox"
                  onChange={() => onFilterChange?.({ category: cat.value })}
                />
                <label htmlFor={cat.value}>{cat.label}</label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Blog posts grid */}
      {isLoading ? (
        <div data-testid="blog-list-skeleton">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-item" />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div 
          data-testid="blog-list-container" 
          className={`grid-cols-${columns} ${variant}`}
        >
          {posts.map((post) => (
            <div key={post.id} className="blog-post-card" data-testid="blog-post-card">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p>{emptyMessage}</p>
        </div>
      )}
      
      {/* Render pagination if needed */}
      {renderTraditionalPagination()}
    </div>
  );
};

export default BlogList; 