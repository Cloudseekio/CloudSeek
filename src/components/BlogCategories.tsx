import React from 'react';
import { Link } from 'react-router-dom';
import { BlogCategory } from '../models/Blog';

interface BlogCategoriesProps {
  categories: BlogCategory[];
  selectedCategory: string;
  onCategorySelect?: (category: string) => void;
  className?: string;
}

const BlogCategories: React.FC<BlogCategoriesProps> = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
      <ul className="space-y-1">
        <li>
          <button
            className={`text-sm w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
              selectedCategory === 'all' ? 'font-semibold text-blue-600 bg-blue-50' : 'text-gray-700'
            }`}
            onClick={() => onCategorySelect && onCategorySelect('all')}
          >
            All Categories <span className="text-gray-500">({categories.reduce((acc, cat) => acc + cat.count, 0)})</span>
          </button>
        </li>
        {categories.map(category => (
          <li key={category.slug}>
            <button
              className={`text-sm w-full text-left px-2 py-1 rounded hover:bg-gray-100 ${
                selectedCategory === category.slug ? 'font-semibold text-blue-600 bg-blue-50' : 'text-gray-700'
              }`}
              onClick={() => onCategorySelect && onCategorySelect(category.slug)}
            >
              {category.name} <span className="text-gray-500">({category.count})</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogCategories; 