import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost, RelatedPost } from '../../models/Blog';
import BlogCard from './BlogCard';
import { useTheme } from '../../context/ThemeContext';
import { ChevronRight } from 'lucide-react';

interface RelatedPostsProps {
  currentPost: BlogPost;
  relatedPosts?: BlogPost[];
  title?: string;
  description?: string;
  limit?: number;
  variant?: 'grid' | 'carousel' | 'horizontal' | 'compact';
  showViewAllLink?: boolean;
  viewAllUrl?: string;
  viewAllLabel?: string;
  className?: string;
  isLoading?: boolean;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({
  currentPost,
  relatedPosts = [],
  title = 'Related Posts',
  description,
  limit = 3,
  variant = 'grid',
  showViewAllLink = false,
  viewAllUrl = '/blog',
  viewAllLabel = 'View all posts',
  className = '',
  isLoading = false
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Filter out the current post if it's in the related posts list
  const filteredPosts = relatedPosts
    .filter(post => post.id !== currentPost.id)
    .slice(0, limit);
  
  // If there are not enough related posts and current post has relatedPosts field
  // we could fetch those specific posts, but for now we'll just handle the display
  
  if (filteredPosts.length === 0 && !isLoading) {
    return null; // Don't render anything if no related posts
  }
  
  // Choose the appropriate card variant based on the layout
  const cardVariant = 
    variant === 'grid' ? 'grid' : 
    variant === 'carousel' ? 'default' : 
    variant === 'horizontal' ? 'horizontal' : 'compact';
  
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  
  return (
    <div className={`my-8 ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className={`text-xl md:text-2xl font-bold ${textColor}`}>
          {title}
        </h2>
        
        {description && (
          <p className={`mt-2 ${textSecondary}`}>
            {description}
          </p>
        )}
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className={`grid grid-cols-1 ${
          variant === 'grid' ? 'md:grid-cols-3' : ''
        } gap-6`}>
          {[...Array(limit)].map((_, i) => (
            <div 
              key={i} 
              className={`animate-pulse ${bgColor} rounded-lg overflow-hidden shadow-sm ${borderColor} border`}
            >
              <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Related posts display */}
      {!isLoading && filteredPosts.length > 0 && (
        <>
          {variant === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <BlogCard 
                  key={post.id}
                  post={post}
                  variant={cardVariant}
                  showExcerpt={true}
                  showCategory={true}
                  maxExcerptLines={2}
                />
              ))}
            </div>
          )}
          
          {variant === 'carousel' && (
            <div className="relative overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex space-x-4">
                {filteredPosts.map(post => (
                  <div key={post.id} className="flex-none w-72 md:w-80">
                    <BlogCard 
                      post={post}
                      variant={cardVariant}
                      showCategory={true}
                      showExcerpt={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {variant === 'horizontal' && (
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <BlogCard 
                  key={post.id}
                  post={post}
                  variant={cardVariant}
                  showExcerpt={true}
                  showCategory={true}
                />
              ))}
            </div>
          )}
          
          {variant === 'compact' && (
            <div className={`rounded-lg overflow-hidden border ${borderColor} ${bgColor}`}>
              {filteredPosts.map((post, index) => (
                <div key={post.id}>
                  <BlogCard 
                    post={post}
                    variant={cardVariant}
                    showExcerpt={false}
                  />
                  {index < filteredPosts.length - 1 && (
                    <hr className={`border-t ${borderColor}`} />
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* View all link */}
          {showViewAllLink && filteredPosts.length > 0 && viewAllUrl && (
            <div className="mt-6 text-right">
              <Link 
                to={viewAllUrl}
                className={`inline-flex items-center text-sm font-medium ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                {viewAllLabel}
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RelatedPosts; 