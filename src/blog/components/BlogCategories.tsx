import React from 'react';
import { BlogCategory } from '../types/blog';

export interface BlogCategoriesProps {
  categories: BlogCategory[];
  selectedCategory: string;
  onCategorySelect: (categorySlug: string) => void;
  isLoading?: boolean;
}

const BlogCategories: React.FC<BlogCategoriesProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  isLoading = false
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategorySelect('all')}
        disabled={isLoading}
        className={`
          px-4 py-1 rounded-full text-sm font-medium transition-colors
          ${selectedCategory === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        All Categories
      </button>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.slug)}
          disabled={isLoading}
          className={`
            px-4 py-1 rounded-full text-sm font-medium transition-colors
            ${selectedCategory === category.slug
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default BlogCategories; 