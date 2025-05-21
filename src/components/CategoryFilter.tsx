import React from 'react';

interface Category {
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect
}) => {
  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          key={category.name}
          className={`category-button ${selectedCategory === category.name ? 'active' : ''}`}
          onClick={() => onCategorySelect(selectedCategory === category.name ? null : category.name)}
        >
          {category.name}
          <span className="category-count">({category.count})</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter; 