import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, X, Filter, SortAsc, SortDesc } from 'lucide-react';
import { BlogFilters } from '../types/blog';
import { useDebounce } from '../hooks/useDebounce';
import logger from '../../utils/logger';

interface BlogSearchProps {
  onSearch: (filters: BlogFilters) => void;
  loading?: boolean;
  error?: string;
  initialFilters?: Partial<BlogFilters>;
  placeholder?: string;
  className?: string;
}

export const BlogSearch: React.FC<BlogSearchProps> = ({
  onSearch,
  loading = false,
  error,
  initialFilters = {},
  placeholder = 'Search blog posts...',
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
  const [filters, setFilters] = useState<BlogFilters>({
    search: initialFilters.search || '',
    category: initialFilters.category,
    tag: initialFilters.tag,
    author: initialFilters.author,
    sortBy: initialFilters.sortBy || 'newest',
    dateFrom: initialFilters.dateFrom,
    dateTo: initialFilters.dateTo
  });
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const filtersPanelRef = useRef<HTMLDivElement>(null);

  // Handle search term changes
  useEffect(() => {
    const newFilters = { ...filters, search: debouncedSearch };
    setFilters(newFilters);
    onSearch(newFilters);
    
    logger.debug('Search filters updated:', { filters: newFilters });
  }, [debouncedSearch]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof BlogFilters, value: string | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
    
    logger.debug('Filter changed:', { key, value, filters: newFilters });
  }, [filters, onSearch]);

  // Handle sort order change
  const toggleSortOrder = useCallback(() => {
    const newSortBy = filters.sortBy === 'newest' ? 'oldest' : 'newest';
    handleFilterChange('sortBy', newSortBy);
  }, [filters.sortBy, handleFilterChange]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters: BlogFilters = {
      search: '',
      sortBy: 'newest'
    };
    setSearchTerm('');
    setFilters(clearedFilters);
    onSearch(clearedFilters);
    
    logger.debug('Filters cleared');
  }, [onSearch]);

  // Close filters panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersPanelRef.current && !filtersPanelRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        {/* Search input */}
        <div className="relative flex-1">
            <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className={`
              w-full pl-10 pr-4 py-2 rounded-lg border
              ${error ? 'border-red-300' : 'border-gray-300'}
              ${loading ? 'bg-gray-50' : 'bg-white'}
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            aria-label="Search blog posts"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          {searchTerm && (
            <button
              onClick={clearFilters}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
            
        {/* Sort toggle */}
            <button
          onClick={toggleSortOrder}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          aria-label="Toggle sort order"
        >
          {filters.sortBy === 'newest' ? (
            <SortDesc className="w-5 h-5 text-gray-600" />
          ) : (
            <SortAsc className="w-5 h-5 text-gray-600" />
          )}
            </button>

        {/* Filters toggle */}
            <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            p-2 rounded-lg border border-gray-300 hover:bg-gray-50
            ${showFilters ? 'bg-blue-50 border-blue-300' : ''}
          `}
          aria-label="Show filters"
          aria-expanded={showFilters}
        >
          <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
      {/* Filters panel */}
      {showFilters && (
        <div
          ref={filtersPanelRef}
          className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10"
        >
          <div className="space-y-4">
            {/* Date range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-1 rounded border border-gray-300 text-sm"
                  aria-label="From date"
                />
                  <input
                    type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-1 rounded border border-gray-300 text-sm"
                  aria-label="To date"
                />
              </div>
            </div>
            
            {/* Sort options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-1 rounded border border-gray-300 text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title-az">Title A-Z</option>
                <option value="title-za">Title Z-A</option>
              </select>
          </div>
          
            {/* Clear filters button */}
                    <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All Filters
                  </button>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Loading indicator */}
      {loading && (
        <div
          className="absolute right-14 top-1/2 -translate-y-1/2"
          data-testid="search-loading-indicator"
        >
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};
