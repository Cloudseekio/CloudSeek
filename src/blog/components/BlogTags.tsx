import React from 'react';
import { BlogTag } from '../../models/Blog';

interface BlogTagsProps {
  tags: BlogTag[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}

const BlogTags: React.FC<BlogTagsProps> = ({
  tags,
  selectedTag,
  onTagSelect
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Tags</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTagSelect('all')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedTag === 'all'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => onTagSelect(tag.slug)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedTag === tag.slug
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogTags; 