import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { BlogPost } from '../../models/Blog';
import { formatDate } from '../../utils/dateUtils';

interface FeaturedBlogPostProps {
  post: BlogPost;
}

const FeaturedBlogPost: React.FC<FeaturedBlogPostProps> = ({ post }) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg">
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative h-[400px] md:h-[500px]">
          {post.coverImage && (
            <img
              src={post.coverImage.url}
              alt={post.coverImage.alt || post.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.category && (
                <span className="inline-block bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded">
                  {post.category.name}
                </span>
              )}
              {post.tags.length > 0 && (
                <span className="inline-block bg-gray-700/70 text-gray-100 text-xs font-medium px-2.5 py-1 rounded">
                  {post.tags[0].name}
                </span>
              )}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {post.title}
            </h2>
            <p className="text-gray-200 text-lg mb-6 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center text-gray-300 text-sm">
              <Clock size={16} className="mr-2" />
              <span>{formatDate(post.publishedAt)}</span>
              <span className="mx-2">•</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedBlogPost; 