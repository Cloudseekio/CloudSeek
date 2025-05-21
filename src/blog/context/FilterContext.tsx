import React, { createContext, useContext, ReactNode } from 'react';
import { BlogFilters } from '../types/blog';
import { useFilterPersistence } from '../hooks/useFilterPersistence';

interface FilterContextType {
  filters: BlogFilters;
  setFilter: (key: keyof BlogFilters, value: string | boolean | undefined) => void;
  resetFilters: () => void;
  toggleFilter: (key: keyof BlogFilters, value: string) => void;
  isFilterActive: (key: keyof BlogFilters, value?: string) => boolean;
}

const FilterContext = createContext<FilterContextType>({
  filters: {},
  setFilter: () => {},
  resetFilters: () => {},
  toggleFilter: () => {},
  isFilterActive: () => false
});

export const useFilters = () => useContext(FilterContext);

interface FilterProviderProps {
  children: ReactNode;
  initialFilters?: Partial<BlogFilters>;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children, initialFilters = {} }) => {
  // Use custom hook for filter persistence (URL parameters)
  const { filters, updateFilters, resetFilters: clearFilters } = 
    useFilterPersistence(initialFilters);

  // Set a single filter
  const setFilter = (key: keyof BlogFilters, value: string | boolean | undefined) => {
    updateFilters({ [key]: value });
  };

  // Reset all filters
  const resetFilters = () => {
    clearFilters();
  };

  // Toggle a filter value (for multi-select filters)
  const toggleFilter = (key: keyof BlogFilters, value: string) => {
    const current = filters[key];
    
    // If it's an array, toggle the value
    if (Array.isArray(current)) {
      const isActive = current.includes(value);
      updateFilters({
        [key]: isActive 
          ? current.filter(v => v !== value) 
          : [...current, value]
      });
      return;
    }
    
    // If it's a string, toggle between the value and undefined
    if (typeof current === 'string') {
      updateFilters({
        [key]: current === value ? undefined : value
      });
      return;
    }
    
    // If it doesn't exist, set it
    updateFilters({ [key]: value });
  };

  // Check if a filter is active
  const isFilterActive = (key: keyof BlogFilters, value?: string): boolean => {
    const filterValue = filters[key];
    
    // If no value is provided, just check if the filter exists
    if (value === undefined) {
      return filterValue !== undefined && filterValue !== '';
    }
    
    // Check array filters
    if (Array.isArray(filterValue)) {
      return filterValue.includes(value);
    }
    
    // Check string filters
    if (typeof filterValue === 'string') {
      return filterValue === value;
    }
    
    // Check boolean filters
    if (typeof filterValue === 'boolean') {
      return filterValue === (value === 'true');
    }
    
    return false;
  };

  return (
    <FilterContext.Provider value={{ filters, setFilter, resetFilters, toggleFilter, isFilterActive }}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;