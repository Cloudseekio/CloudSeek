import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import { BlogFilters } from '../../../blog/types/blog';

// Define the FilterContext type to match the real implementation
interface FilterContextType {
  filters: BlogFilters;
  setFilter: (key: keyof BlogFilters, value: string | boolean | undefined) => void;
  resetFilters: () => void;
  toggleFilter: (key: keyof BlogFilters, value: string) => void;
  isFilterActive: (key: keyof BlogFilters, value?: string) => boolean;
}

// Create the context with default values
const FilterContext = createContext<FilterContextType>({
  filters: {},
  setFilter: () => {},
  resetFilters: () => {},
  toggleFilter: () => {},
  isFilterActive: () => false
});

// Create a mock state for testing
let mockFilters: BlogFilters = {};
const mockSetFilter = jest.fn();
const mockResetFilters = jest.fn();
const mockToggleFilter = jest.fn();
const mockIsFilterActive = jest.fn().mockReturnValue(false);

// Export the useFilters hook
export const useFilters = jest.fn().mockImplementation(() => {
  return {
    filters: mockFilters,
    setFilter: mockSetFilter,
    resetFilters: mockResetFilters,
    toggleFilter: mockToggleFilter,
    isFilterActive: mockIsFilterActive
  };
});

// Create a mock FilterProvider component
interface FilterProviderProps {
  children: ReactNode;
  initialFilters?: Partial<BlogFilters>;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ 
  children, 
  initialFilters = {} 
}) => {
  const [filters, setFilters] = useState<BlogFilters>(initialFilters as BlogFilters);

  const setFilter = (key: keyof BlogFilters, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    mockSetFilter(key, value);
  };

  const resetFilters = () => {
    setFilters({});
    mockResetFilters();
  };

  const toggleFilter = (key: keyof BlogFilters, value: string) => {
    setFilters(prev => {
      const prevValue = prev[key];
      
      // If it's an array, toggle the value
      if (Array.isArray(prevValue)) {
        const newValue = prevValue.includes(value)
          ? prevValue.filter(v => v !== value)
          : [...prevValue, value];
        return { ...prev, [key]: newValue };
      }
      
      // For string values, toggle between the value and undefined
      if (typeof prevValue === 'string') {
        return { ...prev, [key]: prevValue === value ? undefined : value };
      }
      
      // For boolean values or undefined, toggle between true and false
      return { ...prev, [key]: !prevValue };
    });
    
    mockToggleFilter(key, value);
  };

  const isFilterActive = (key: keyof BlogFilters, value?: string) => {
    const filterValue = filters[key];
    
    // If a specific value is provided, check if it's included in the filter
    if (value !== undefined) {
      if (Array.isArray(filterValue)) {
        return filterValue.includes(value);
      }
      return filterValue === value;
    }
    
    // Otherwise check if the filter has any value
    if (typeof filterValue === 'boolean') return filterValue;
    if (Array.isArray(filterValue)) return filterValue.length > 0;
    return !!filterValue;
  };

  return (
    <FilterContext.Provider value={{ 
      filters, 
      setFilter, 
      resetFilters, 
      toggleFilter, 
      isFilterActive 
    }}>
      {children}
    </FilterContext.Provider>
  );
};

// Reset functions for testing
export const resetMockFilters = () => {
  mockFilters = {};
  mockSetFilter.mockClear();
  mockResetFilters.mockClear();
  mockToggleFilter.mockClear();
  mockIsFilterActive.mockClear();
  mockIsFilterActive.mockReturnValue(false);
};

// Configure mock functions for testing
export const setMockFilters = (filters: BlogFilters) => {
  mockFilters = filters;
};

export const setMockIsFilterActive = (returnValue: boolean) => {
  mockIsFilterActive.mockReturnValue(returnValue);
};

// Default export
export default { useFilters, FilterProvider, resetMockFilters, setMockFilters, setMockIsFilterActive }; 