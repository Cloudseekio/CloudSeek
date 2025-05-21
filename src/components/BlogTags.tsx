import React from 'react';
import { BlogTag } from '../blog/types/blog';

export interface BlogTagsProps {
  tags: BlogTag[];
  selectedTag: string;
  onTagSelect: (tagSlug: string) => void;
  isLoading?: boolean;
}

const BlogTags: React.FC<BlogTagsProps> = ({
  tags,
  selectedTag,
  onTagSelect,
  isLoading = false
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onTagSelect('all')}
        disabled={isLoading}
        className={`
          px-3 py-1 rounded-full text-sm font-medium transition-colors
          ${selectedTag === 'all'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        All Tags
      </button>
      {tags.map(tag => (
        <button
          key={tag.id}
          onClick={() => onTagSelect(tag.slug)}
          disabled={isLoading}
          className={`
            px-3 py-1 rounded-full text-sm font-medium transition-colors
            ${selectedTag === tag.slug
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
};

export default BlogTags; 