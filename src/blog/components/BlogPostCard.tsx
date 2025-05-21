import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { BlogPost, BlogCategory } from '../types/blog';
import { formatBlogDate } from '../../utils/blogUtils';
import { getBlogPostUrl } from '../../utils/routes';
import { validateBlogPost } from '../utils/validation';
import { ErrorMessage } from './error/ErrorMessage';
import { OptimizedImage } from './OptimizedImage';
import BlogPostSkeleton from './BlogPostSkeleton';
import { cn } from '../../utils/cn';
import logger from '../../utils/logger';

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact' | 'featured';
  loading?: boolean;
  className?: string;
}

interface CoverImage {
  url?: string;
  alt?: string;
}

// The main component implementation
const BlogPostCardComponent: React.FC<BlogPostCardProps> = ({
  post,
  variant = 'default',
  loading = false,
  className
}) => {
  if (loading) {
    return <BlogPostSkeleton featured={variant === 'featured'} compact={variant === 'compact'} className={className} />;
  }

  try {
    // Validate the post data
    const validatedPost = validateBlogPost(post);
    const author = validatedPost.authors[0] || { name: 'Unknown Author' };
    
    return (
      <div 
        className={cn(
          'group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300',
          'hover:shadow-lg hover:-translate-y-1',
          variant === 'compact' ? 'h-[280px]' : variant === 'featured' ? 'h-[420px]' : 'h-[320px]',
          className
        )}
        data-testid="blog-post-card"
      >
        <Link to={getBlogPostUrl(validatedPost.slug || '')} className="block h-full">
          <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden">
            <OptimizedImage
              src={validatedPost.coverImage?.url || '/images/placeholder.jpg'}
              alt={validatedPost.coverImage?.alt || validatedPost.title}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              fallbackSrc="/images/placeholder.jpg"
              onError={(error) => {
                logger.error('Failed to load blog post image:', {
                  error: error.message,
                  postId: validatedPost.id,
                  imageUrl: validatedPost.coverImage?.url
                });
              }}
            />
          </div>
          
          <div className="p-6">
            <div className="mb-3">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {typeof validatedPost.category === 'string' ? validatedPost.category : validatedPost.category.name}
              </span>
            </div>
            
            <h3 className={cn(
              'font-bold text-gray-900 mb-3 transition-colors group-hover:text-blue-600',
              variant === 'compact' ? 'text-lg line-clamp-2' : 'text-2xl line-clamp-3'
            )}>
              {validatedPost.title}
            </h3>
            
            {variant !== 'compact' && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {validatedPost.excerpt}
              </p>
            )}
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <User size={16} className="mr-1" />
                <span className="truncate max-w-[120px]">{author.name}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{formatBlogDate(validatedPost.publishDate)}</span>
              </div>
          </div>
        </div>
      </Link>
    </div>
  );
  } catch (error) {
    return (
      <ErrorMessage
        title="Invalid Blog Post"
        message="This post contains invalid data and cannot be displayed."
        severity="warning"
        details={error instanceof Error ? error.message : 'Unknown error'}
        className={className}
      />
    );
  }
};

// Custom prop comparison function
function arePropsEqual(prevProps: BlogPostCardProps, nextProps: BlogPostCardProps): boolean {
  // Simple equality for primitive props
  const primitivePropsEqual = 
    prevProps.variant === nextProps.variant &&
    prevProps.loading === nextProps.loading &&
    prevProps.className === nextProps.className;
    
  // If primitive props are not equal, return false immediately
  if (!primitivePropsEqual) return false;
  
  // If either is loading, we don't need to compare post objects
  if (prevProps.loading || nextProps.loading) return primitivePropsEqual;
  
  // For post object, we need deep comparison of relevant parts
  // Only check fields that affect rendering
  const prevPost = prevProps.post;
  const nextPost = nextProps.post;
  
  // For performance, check individual fields before doing deep compare
  const basicPostEqual = 
    prevPost.id === nextPost.id &&
    prevPost.title === nextPost.title &&
    prevPost.slug === nextPost.slug &&
    (prevPost.excerpt || '') === (nextPost.excerpt || '') &&
    prevPost.publishDate === nextPost.publishDate;
    
  if (!basicPostEqual) return false;
  
  // Compare cover image
  const prevImage = prevPost.coverImage as CoverImage || {};
  const nextImage = nextPost.coverImage as CoverImage || {};
  const imageEqual = (prevImage.url || '') === (nextImage.url || '') && 
                      (prevImage.alt || '') === (nextImage.alt || '');
  if (!imageEqual) return false;
  
  // Compare category
  let categoryEqual = false;
  if (typeof prevPost.category === 'string' && typeof nextPost.category === 'string') {
    categoryEqual = prevPost.category === nextPost.category;
  } else if (
    typeof prevPost.category === 'object' && prevPost.category !== null &&
    typeof nextPost.category === 'object' && nextPost.category !== null
  ) {
    const prevCategory = prevPost.category as BlogCategory;
    const nextCategory = nextPost.category as BlogCategory;
    categoryEqual = prevCategory.name === nextCategory.name;
  }
  if (!categoryEqual) return false;
  
  // Compare first author
  const prevAuthor = prevPost.authors?.[0] || { name: 'Unknown Author' };
  const nextAuthor = nextPost.authors?.[0] || { name: 'Unknown Author' };
  return prevAuthor.name === nextAuthor.name;
}

// Create memoized version of the component
const BlogPostCard = memo(BlogPostCardComponent, arePropsEqual);

// For debugging in development
if (process.env.NODE_ENV !== 'production') {
  BlogPostCard.displayName = 'MemoizedBlogPostCard';
}

export default BlogPostCard; 