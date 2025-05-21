import { useState, useCallback, useMemo } from 'react';
import { BlogFilters } from '../types/blog';

/**
 * A simplified version of the hook without URL parameter manipulation for testing purposes
 */
export function useFilterPersistence(initialFilters?: Partial<BlogFilters>) {
  const [filters, setFilters] = useState<BlogFilters>(() => {
    // Initialize with provided filters
    return initialFilters as BlogFilters || {};
  });

  // Update filters with partial values
  const updateFilters = useCallback((newFilters: Partial<BlogFilters>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  }, []);

  // Reset filters to empty object
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Check if a filter is active
  const isFilterActive = useCallback((key: keyof BlogFilters) => {
    const value = filters[key];
    if (typeof value === 'boolean') return value;
    if (Array.isArray(value)) return value.length > 0;
    return !!value;
  }, [filters]);

  // Return the hook state and functions
  return useMemo(() => ({
    filters,
    updateFilters,
    resetFilters,
    isFilterActive
  }), [filters, updateFilters, resetFilters, isFilterActive]);
}

export default useFilterPersistence; 