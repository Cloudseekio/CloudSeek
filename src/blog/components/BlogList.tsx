'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types/blog';
import { formatBlogDate } from '../../utils/blogUtils';
import { getBlogPostUrl } from '../../utils/routes';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useInView } from 'react-intersection-observer';
import BlogPostCard from './BlogPostCard';
import { OptimizedImage } from './OptimizedImage';
import BlogErrorBoundary from './error/BlogErrorBoundary';
import { cn } from '../../utils/cn';
import logger from '../../utils/logger';
import isEqual from 'lodash/isEqual';
import { EnhancedBlogCardSkeletonGrid } from './skeletons/EnhancedBlogCardSkeleton';

interface BlogListProps {
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
  onFilterChange?: (filters: Record<string, string>) => void;
  // Pagination props
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number, itemsPerPage?: number) => void;
  // Infinite scroll props
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  paginationType?: 'traditional' | 'infinite';
}

// Featured posts carousel/slider
const FeaturedPostsSlider: React.FC<{ posts: BlogPost[] }> = memo(({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { theme } = useTheme();
  
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
  }, [posts.length]);
  
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
  }, [posts.length]);
  
  // Auto-advance slides
  useEffect(() => {
    if (posts.length <= 1) return;
    
    const intervalId = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => clearInterval(intervalId);
  }, [posts.length, nextSlide]);
  
  if (!posts.length) return null;
  
  return (
    <div className="relative mb-10 overflow-hidden rounded-xl">
      <div 
        className={`transition-transform duration-500 ease-in-out flex ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {posts.map((post) => (
          <div key={post.id} className="w-full flex-shrink-0">
            <div className="relative">
              <div className="relative h-[400px] md:h-[500px] w-full">
                {post.coverImage && typeof post.coverImage === 'object' && 'url' in post.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <OptimizedImage
                      src={post.coverImage.url}
                      alt={post.coverImage.alt || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      fallbackSrc="/images/placeholder.jpg"
                      onError={(error) => {
                        logger.error('Failed to load blog list image:', {
                          error: error.message,
                          postId: post.id,
                          imageUrl: typeof post.coverImage?.url === 'string' ? post.coverImage.url : 'undefined'
                        });
                      }}
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.category && typeof post.category === 'object' && 'name' in post.category && (
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 text-xs font-medium px-2.5 py-1 rounded">
                      {post.category.name}
                    </span>
                  )}
                  {post.tags.length > 0 && typeof post.tags[0] === 'object' && 'name' in post.tags[0] && (
                    <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded">
                      {post.tags[0].name}
                    </span>
                  )}
                </div>
                
                <h2 className="text-2xl md:text-4xl font-bold mb-3 text-white">
                  {post.title}
                </h2>
                
                <p className="text-gray-200 mb-4 max-w-2xl text-sm md:text-base">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between flex-wrap gap-y-4">
                  <div className="flex items-center">
                    {post.authors && post.authors[0] && (
                      <>
                        <img 
                          src={post.authors[0].avatar || '/images/avatars/default.jpg'} 
                          alt={post.authors[0].name}
                          className="w-8 h-8 rounded-full mr-2 border-2 border-white"
                        />
                        <span className="text-white font-medium mr-4">{post.authors[0].name}</span>
                      </>
                    )}
                    <span className="text-gray-300 text-sm">
                      {formatBlogDate(post.publishDate)} • {post.readingTime} min read
                    </span>
                  </div>
                  
                  <Link 
                    to={getBlogPostUrl(post.slug)} 
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    Read Article
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {posts.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
          
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {posts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors focus:outline-none
                  ${currentIndex === idx ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
});

// Main BlogList component implementation
const BlogListComponent: React.FC<BlogListProps> = ({
  posts,
  featuredPosts = [],
  isLoading = false,
  emptyMessage = 'No articles found',
  columns = 3,
  variant = 'default',
  showFeaturedSlider = false,
  filterOptions,
  onFilterChange,
  // Pagination props
  totalItems = 0,
  currentPage = 1,
  itemsPerPage = 12,
  onPageChange,
  // Infinite scroll props
  hasNextPage = false,
  onLoadMore,
  loadingMore = false,
  paginationType = 'traditional'
}) => {
  const { theme } = useTheme();
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const { ref: infiniteScrollRef, inView } = useInView({
    threshold: 0.5,
    skip: !hasNextPage || loadingMore || paginationType !== 'infinite'
  });

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !loadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [inView, hasNextPage, loadingMore, onLoadMore]);

  // Calculate total pages
  const totalPages = useMemo(() => Math.ceil(totalItems / itemsPerPage), [totalItems, itemsPerPage]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && onPageChange) {
      onPageChange(page);
    }
  }, [totalPages, onPageChange]);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    if (onPageChange) {
      // If onPageChange accepts an optional second parameter, we'll use it
      onPageChange(1, newItemsPerPage);
    }
  }, [onPageChange]);

  // Get grid columns class
  const getGridColumns = useCallback(() => {
    const baseClass = 'grid gap-6';
    switch (columns) {
      case 1:
        return `${baseClass} grid-cols-1`;
      case 2:
        return `${baseClass} grid-cols-1 md:grid-cols-2`;
      case 3:
        return `${baseClass} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
      case 4:
        return `${baseClass} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
      default:
        return `${baseClass} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
    }
  }, [columns]);

  // Render pagination controls
  const paginationElement = useMemo(() => {
    if (paginationType !== 'traditional' || totalPages <= 1) return null;

    return (
      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={cn(
            'p-2 rounded-lg border',
            theme === 'dark'
              ? 'border-gray-700 hover:bg-gray-800'
              : 'border-gray-200 hover:bg-gray-50',
            (currentPage === 1 || isLoading) && 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={isLoading}
              className={cn(
                'px-3 py-1 rounded-md text-sm font-medium',
                page === currentPage
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white'
                  : theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={cn(
            'p-2 rounded-lg border',
            theme === 'dark'
              ? 'border-gray-700 hover:bg-gray-800'
              : 'border-gray-200 hover:bg-gray-50',
            (currentPage === totalPages || isLoading) && 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          disabled={isLoading}
          className={cn(
            'ml-4 px-3 py-1 rounded border text-sm',
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-gray-200'
              : 'bg-white border-gray-200 text-gray-700'
          )}
          aria-label="Items per page"
        >
          <option value="12">12 per page</option>
          <option value="24">24 per page</option>
          <option value="48">48 per page</option>
        </select>
      </div>
    );
  }, [paginationType, totalPages, currentPage, handlePageChange, isLoading, theme, itemsPerPage, handleItemsPerPageChange]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterKey: string, value: string) => {
    if (onFilterChange) {
      const newFilters = { ...activeFilters, [filterKey]: value };
      setActiveFilters(newFilters);
      onFilterChange(newFilters);
    }
  }, [activeFilters, onFilterChange]);

  // Render infinite scroll loader
  const infiniteScrollLoader = useMemo(() => {
    if (paginationType !== 'infinite' || !hasNextPage) return null;

    return (
      <div
        ref={infiniteScrollRef}
        className={cn(
          'w-full py-8 flex items-center justify-center',
          loadingMore ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }, [paginationType, hasNextPage, infiniteScrollRef, loadingMore]);

  return (
    <BlogErrorBoundary>
      <div className="space-y-8">
        {/* Featured posts slider */}
        {showFeaturedSlider && featuredPosts.length > 0 && (
          <FeaturedPostsSlider posts={featuredPosts} />
        )}
      
        {/* Filter options */}
        {filterOptions && (
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Render filter options if they exist */}
            {filterOptions.categories && filterOptions.categories.length > 0 && (
              <div className="filter-group">
                <span className="text-sm font-medium mr-2">Category:</span>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => handleFilterChange('category', category.value)}
                      className={cn(
                        'px-3 py-1 text-sm rounded-full',
                        activeFilters.category === category.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                      )}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
              
        {/* Blog posts grid */}
        {isLoading && !loadingMore ? (
          // Enhanced skeleton grid
          <EnhancedBlogCardSkeletonGrid 
            count={itemsPerPage} 
            columns={columns} 
            variant={variant}
            className="fade-in"
          />
        ) : posts.length > 0 ? (
          <>
            <div className={getGridColumns()}>
              {posts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  variant={variant}
                />
              ))}
            </div>
            {paginationElement}
            {infiniteScrollLoader}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
          </div>
        )}
      </div>
    </BlogErrorBoundary>
  );
};

// Custom comparison function for BlogList props
function arePropsEqual(prevProps: BlogListProps, nextProps: BlogListProps): boolean {
  // Simple comparison for primitive props
  if (
    prevProps.isLoading !== nextProps.isLoading ||
    prevProps.loadingMore !== nextProps.loadingMore ||
    prevProps.currentPage !== nextProps.currentPage ||
    prevProps.totalItems !== nextProps.totalItems ||
    prevProps.itemsPerPage !== nextProps.itemsPerPage ||
    prevProps.columns !== nextProps.columns ||
    prevProps.variant !== nextProps.variant ||
    prevProps.showFeaturedSlider !== nextProps.showFeaturedSlider ||
    prevProps.emptyMessage !== nextProps.emptyMessage ||
    prevProps.paginationType !== nextProps.paginationType ||
    prevProps.hasNextPage !== nextProps.hasNextPage
  ) {
    return false;
  }

  // Deep comparison for object props
  if (!isEqual(prevProps.posts, nextProps.posts)) return false;
  if (!isEqual(prevProps.featuredPosts, nextProps.featuredPosts)) return false;
  if (!isEqual(prevProps.filterOptions, nextProps.filterOptions)) return false;

  // Function references comparison - treat as always equal if signatures are the same
  // since we can't reliably compare function equality

  return true;
}

// Export the memoized component
const BlogList = memo(BlogListComponent, arePropsEqual);

export default BlogList; 