import React from 'react';
import { useFilters } from '../context/FilterContext';
import { BlogCategory, BlogTag, Author, BlogFilters } from '../types/blog';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

interface FilterPanelProps {
  categories?: BlogCategory[];
  tags?: BlogTag[];
  authors?: Author[];
  className?: string;
  showActiveFilters?: boolean;
  showSort?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  categories = [],
  tags = [],
  authors = [],
  className,
  showActiveFilters = true,
  showSort = true
}) => {
  const { filters, updateFilters, resetFilters, isFilterActive } = useFilters();

  const handleCategoryChange = (categorySlug: string) => {
    updateFilters({ category: categorySlug === 'all' ? undefined : categorySlug });
  };

  const handleTagChange = (tagSlug: string) => {
    updateFilters({ tag: tagSlug === 'all' ? undefined : tagSlug });
  };

  const handleAuthorChange = (authorId: string) => {
    updateFilters({ author: authorId === 'all' ? undefined : authorId });
  };

  const handleSortChange = (sortBy: string) => {
    updateFilters({ sortBy: sortBy as BlogFilters['sortBy'] });
  };

  const handleFeaturedChange = (featured: boolean) => {
    updateFilters({ featured });
  };

  const removeFilter = (key: keyof BlogFilters) => {
    updateFilters({ [key]: undefined });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Active filters */}
      {showActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {(Object.keys(filters) as Array<keyof BlogFilters>).map(key => {
            if (!isFilterActive(key)) return null;
            return (
              <button
                key={key}
                onClick={() => removeFilter(key)}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
              >
                {key}: {String(filters[key])}
                <X size={14} />
              </button>
            );
          })}
          {Object.values(filters).some(value => value !== undefined) && (
            <button
              onClick={resetFilters}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Filter groups */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={cn(
                  'px-3 py-1 text-sm rounded-full',
                  !filters.category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category.slug}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-full',
                    filters.category === category.slug
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTagChange('all')}
                className={cn(
                  'px-3 py-1 text-sm rounded-full',
                  !filters.tag
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                All
              </button>
              {tags.map(tag => (
                <button
                  key={tag.slug}
                  onClick={() => handleTagChange(tag.slug)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-full',
                    filters.tag === tag.slug
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Authors */}
        {authors.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Authors</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAuthorChange('all')}
                className={cn(
                  'px-3 py-1 text-sm rounded-full',
                  !filters.author
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                All
              </button>
              {authors.map(author => (
                <button
                  key={author.id}
                  onClick={() => handleAuthorChange(author.id)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-full',
                    filters.author === author.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {author.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sort options */}
      {showSort && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="text-sm border-gray-300 rounded-md"
            aria-label="Sort posts by"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title-az">Title A-Z</option>
            <option value="title-za">Title Z-A</option>
          </select>

          <label className="inline-flex items-center gap-2 ml-4">
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={(e) => handleFeaturedChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">Featured only</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default FilterPanel; 