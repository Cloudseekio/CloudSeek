import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../models/Blog';
import BlogCard from './BlogCard';
import { usePostsQuery } from '../hooks/useBlogQuery';
import { useTheme } from '../../context/ThemeContext';
import { TrendingUp, ThumbsUp, ChevronRight, Clock } from 'lucide-react';

interface PopularPostsProps {
  title?: string;
  description?: string;
  limit?: number;
  excludePostId?: string;
  timeframe?: 'week' | 'month' | 'year' | 'all';
  type?: 'trending' | 'popular' | 'most-read';
  variant?: 'sidebar' | 'grid' | 'featured' | 'minimal';
  showReadTime?: boolean;
  showHeading?: boolean;
  showViewAllLink?: boolean;
  viewAllUrl?: string;
  className?: string;
}

const PopularPosts: React.FC<PopularPostsProps> = ({
  title,
  description,
  limit = 5,
  excludePostId,
  timeframe = 'month',
  type = 'popular',
  variant = 'sidebar',
  showReadTime = true,
  showHeading = true,
  showViewAllLink = true,
  viewAllUrl = '/blog/popular',
  className = '',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Fetch popular posts (in a real app, this would be a specialized query)
  const { data: posts, isLoading, error } = usePostsQuery({ 
    sortBy: type === 'trending' ? 'trending' : 'popularity' 
  });
  
  // Filter out the excluded post and limit the results
  const filteredPosts = posts
    ?.filter(post => !excludePostId || post.id !== excludePostId)
    .slice(0, limit);
  
  if (error || (!isLoading && (!posts || posts.length === 0))) {
    return null; // Don't render anything on error or no posts
  }
  
  // Default title based on type
  const defaultTitle = 
    type === 'trending' ? 'Trending Now' : 
    type === 'most-read' ? 'Most Read' : 
    'Popular Posts';
  
  const displayTitle = title || defaultTitle;
  
  // Helper to render the type icon
  const TypeIcon = () => {
    if (type === 'trending') {
      return <TrendingUp size={18} className="mr-2" />;
    } else if (type === 'most-read') {
      return <Clock size={18} className="mr-2" />;
    } else {
      return <ThumbsUp size={18} className="mr-2" />;
    }
  };
  
  // Text and bg colors based on theme
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  
  // Card variant based on layout
  const cardVariant = 
    variant === 'grid' ? 'grid' : 
    variant === 'featured' ? 'featured' : 
    variant === 'minimal' ? 'minimal' : 
    'compact';
  
  return (
    <div className={`${className}`}>
      {/* Heading */}
      {showHeading && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className={`flex items-center text-lg font-bold ${textColor}`}>
              <TypeIcon />
              {displayTitle}
            </h2>
            {description && (
              <p className={`mt-1 text-sm ${textSecondary}`}>
                {description}
              </p>
            )}
          </div>
          
          {showViewAllLink && (
            <Link
              to={viewAllUrl}
              className={`text-sm font-medium flex items-center ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
              }`}
            >
              View all
              <ChevronRight size={16} className="ml-1" />
            </Link>
          )}
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="animate-pulse">
          {variant === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(limit)].map((_, i) => (
                <div key={i} className={`rounded-lg overflow-hidden shadow ${bgColor}`}>
                  <div className="h-40 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {[...Array(limit)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-16 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Posts display */}
      {!isLoading && filteredPosts && filteredPosts.length > 0 && (
        <>
          {variant === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPosts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  variant={cardVariant}
                  showReadTime={showReadTime}
                  showCategory={true}
                  showExcerpt={true}
                  maxExcerptLines={2}
                  imagePriority={index === 0}
                />
              ))}
            </div>
          )}
          
          {variant === 'featured' && (
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <div key={post.id}>
                  {index === 0 ? (
                    <BlogCard
                      post={post}
                      variant="featured"
                      showReadTime={showReadTime}
                      showCategory={true}
                      showExcerpt={true}
                      imagePriority={true}
                    />
                  ) : (
                    <BlogCard
                      post={post}
                      variant="horizontal"
                      showReadTime={showReadTime}
                      showCategory={true}
                      showExcerpt={index < 3}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          
          {variant === 'minimal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  variant="minimal"
                  showReadTime={showReadTime}
                  showCategory={false}
                  showExcerpt={false}
                />
              ))}
            </div>
          )}
          
          {variant === 'sidebar' && (
            <div className={`rounded-lg border ${borderColor} overflow-hidden`}>
              {filteredPosts.map((post, index) => (
                <div key={post.id}>
                  <BlogCard
                    post={post}
                    variant="compact"
                    showReadTime={showReadTime}
                    showCategory={false}
                    showExcerpt={false}
                  />
                  {index < filteredPosts.length - 1 && (
                    <hr className={`border-t ${borderColor}`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PopularPosts; 