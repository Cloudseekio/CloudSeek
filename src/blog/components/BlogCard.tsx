import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../models/Blog';
import { formatDate } from '../../utils/dateUtils';
import { useTheme } from '../../context/ThemeContext';
import AssetRenderer from './contentful/AssetRenderer';
import { CombinedAsset } from '../types/contentful';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'horizontal' | 'minimal' | 'compact' | 'featured' | 'list' | 'grid' | 'overlay';
  className?: string;
  showCategory?: boolean;
  showExcerpt?: boolean;
  showAuthor?: boolean;
  showReadTime?: boolean;
  showDate?: boolean;
  showBookmark?: boolean;
  isBookmarked?: boolean;
  onBookmark?: (postId: string) => void;
  showLike?: boolean;
  isLiked?: boolean;
  onLike?: (postId: string) => void;
  maxExcerptLines?: number;
  imagePriority?: boolean;
  onClick?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({
  post,
  variant = 'default',
  className = '',
  showCategory = true,
  showExcerpt = true,
  showAuthor = false,
  showReadTime = true,
  showDate = true,
  showBookmark = false,
  isBookmarked = false,
  onBookmark,
  showLike = false,
  isLiked = false,
  onLike,
  maxExcerptLines = 3,
  imagePriority = false,
  onClick
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBookmark?.(post.id);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike?.(post.id);
  };

  const getImageType = () => {
    switch (variant) {
      case 'featured':
        return 'cover';
      case 'compact':
      case 'list':
        return 'thumbnail';
      default:
        return 'thumbnail';
    }
  };

  const getImageAspectRatio = () => {
    switch (variant) {
      case 'featured':
        return 16/9;
      case 'horizontal':
        return 4/3;
      case 'compact':
        return 1;
      default:
        return 3/2;
    }
  };

  const cardClasses = `
    group relative overflow-hidden rounded-lg transition-all duration-300
    ${variant === 'overlay' ? 'aspect-[3/4]' : ''}
    ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}
    ${variant === 'horizontal' ? 'flex gap-4' : ''}
    ${className}
  `;

  const imageClasses = `
    overflow-hidden rounded-lg
    ${variant === 'horizontal' ? 'w-1/3' : 'w-full'}
    ${variant === 'overlay' ? 'absolute inset-0' : ''}
  `;

  const contentClasses = `
    ${variant === 'horizontal' ? 'w-2/3' : 'w-full'}
    ${variant === 'overlay' ? 'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white' : ''}
    ${!variant.match(/overlay|horizontal/) ? 'p-4' : ''}
  `;

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={cardClasses}
      onClick={onClick}
    >
      {post.coverImage && (
        <div className={imageClasses}>
          <AssetRenderer
            asset={post.coverImage as CombinedAsset}
            type={getImageType()}
            aspectRatio={getImageAspectRatio()}
            priority={imagePriority}
            className="w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className={contentClasses}>
        {showCategory && post.category && (
          <Link
            to={`/blog/category/${post.category.slug}`}
            className={`
              inline-block px-2 py-1 text-xs font-medium rounded-full mb-2
              ${isDark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800'}
            `}
            onClick={e => e.stopPropagation()}
          >
            {post.category.name}
          </Link>
        )}

        <h3 className={`
          font-bold mb-2 line-clamp-2
          ${variant === 'featured' ? 'text-2xl' : 'text-lg'}
          ${variant === 'overlay' ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'}
        `}>
            {post.title}
          </h3>

        {showExcerpt && (
          <p
            className={`
              mb-4 text-sm
              ${variant === 'overlay' ? 'text-gray-200' : isDark ? 'text-gray-300' : 'text-gray-600'}
            `}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: maxExcerptLines,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
              {post.excerpt}
            </p>
        )}

        <div className={`
          flex items-center gap-4 text-sm
          ${variant === 'overlay' ? 'text-gray-200' : isDark ? 'text-gray-400' : 'text-gray-500'}
        `}>
          {showDate && (
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          )}

          {showReadTime && (
            <span>{post.readingTime} min read</span>
          )}

          {showBookmark && (
            <button
              onClick={handleBookmarkClick}
              className={`
                p-1 rounded-full transition-colors
                ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              `}
              aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
            >
              <svg
                className={`w-5 h-5 ${isBookmarked ? 'fill-current' : 'stroke-current'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          )}

          {showLike && (
            <button
              onClick={handleLikeClick}
              className={`
                p-1 rounded-full transition-colors
                ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              `}
              aria-label={isLiked ? "Unlike this post" : "Like this post"}
            >
              <svg
                className={`w-5 h-5 ${isLiked ? 'fill-current text-red-500' : 'stroke-current'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
            </div>

        {showAuthor && post.authors?.[0] && (
          <div className="flex items-center mt-4 space-x-3">
            {post.authors[0].avatar && (
              <AssetRenderer
                asset={post.authors[0].avatar as unknown as CombinedAsset}
                type="avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className={variant === 'overlay' ? 'text-white' : ''}>
              <p className="text-sm font-medium">{post.authors[0].name}</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default BlogCard; 