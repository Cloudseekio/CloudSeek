import React, { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useFilters } from '../context/FilterContext';
import { cn } from '../../utils/cn';
import { debounce } from '../../utils/debounce';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className,
  placeholder = 'Search posts...',
  debounceMs = 300
}) => {
  const { filters, updateFilters } = useFilters();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      updateFilters({ search: value || undefined });
    }, debounceMs),
    [updateFilters, debounceMs]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleClear = () => {
    setSearchTerm('');
    updateFilters({ search: undefined });
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar; 