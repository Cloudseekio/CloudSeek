import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { BlogPost } from '../blog/types/blog';
import { formatBlogDate } from '../utils/blogUtils';
import { getBlogPostUrl } from '../utils/routes';
import { validateBlogPost } from '../blog/utils/validation';
import { ErrorMessage } from '../blog/components/error/ErrorMessage';
import { OptimizedImage } from '../blog/components/OptimizedImage';
import logger from '../utils/logger';

interface FeaturedBlogPostProps {
  post: BlogPost;
}

const FeaturedBlogPost: React.FC<FeaturedBlogPostProps> = ({ post }) => {
  try {
    // Validate the post data
    const validatedPost = validateBlogPost(post);
    const author = validatedPost.authors[0] || { name: 'Unknown Author' };
    
    return (
      <div className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
        <Link to={getBlogPostUrl(validatedPost.slug)} className="block">
          <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden">
            <OptimizedImage
              src={validatedPost.coverImage?.url || '/images/placeholder.jpg'}
              alt={validatedPost.coverImage?.alt || validatedPost.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
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
        </Link>
        <div className="p-6">
          <div className="mb-3">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {typeof validatedPost.category === 'string' ? validatedPost.category : validatedPost.category.name}
            </span>
          </div>
          <Link to={getBlogPostUrl(validatedPost.slug)} className="block">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
              {validatedPost.title}
            </h3>
          </Link>
          <p className="text-gray-600 mb-4">
            {validatedPost.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <User size={16} className="mr-1" />
              <span>{author.name}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{formatBlogDate(validatedPost.publishDate)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <ErrorMessage
        title="Invalid Blog Post"
        message="This post contains invalid data and cannot be displayed."
        severity="warning"
        details={error instanceof Error ? error.message : 'Unknown error'}
      />
    );
  }
};

export default FeaturedBlogPost; 