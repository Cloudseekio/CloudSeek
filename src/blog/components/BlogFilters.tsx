import React from 'react';
import { BlogCategory, BlogTag, Author } from '../types/blog';
import { FilterPanel } from './FilterPanel';
import { SearchBar } from './SearchBar';
import { cn } from '../../utils/cn';

interface BlogFiltersProps {
  categories?: BlogCategory[];
  tags?: BlogTag[];
  authors?: Author[];
  className?: string;
  showActiveFilters?: boolean;
  showSort?: boolean;
}

export const BlogFilters: React.FC<BlogFiltersProps> = ({
  categories,
  tags,
  authors,
  className,
  showActiveFilters = true,
  showSort = true
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      <SearchBar className="max-w-md" />
      <FilterPanel
        categories={categories}
        tags={tags}
        authors={authors}
        showActiveFilters={showActiveFilters}
        showSort={showSort}
      />
    </div>
  );
};

export default BlogFilters;