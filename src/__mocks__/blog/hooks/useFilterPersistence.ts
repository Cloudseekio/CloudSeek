import { BlogFilters } from '../../../blog/types/blog';

// Mock state
let mockFilters: BlogFilters = {};
const mockUpdateFilters = jest.fn();
const mockResetFilters = jest.fn();
const mockIsFilterActive = jest.fn().mockReturnValue(false);

/**
 * A mock version of the useFilterPersistence hook for testing
 */
export function useFilterPersistence(initialFilters?: Partial<BlogFilters>) {
  // Initialize internal mock state if initial filters provided
  if (initialFilters) {
    mockFilters = { ...initialFilters as BlogFilters };
  }

  return {
    filters: mockFilters,
    updateFilters: mockUpdateFilters,
    resetFilters: mockResetFilters,
    isFilterActive: mockIsFilterActive
  };
}

// Reset mock state for testing
export const resetMockState = () => {
  mockFilters = {};
  mockUpdateFilters.mockClear();
  mockResetFilters.mockClear();
  mockIsFilterActive.mockClear();
  mockIsFilterActive.mockReturnValue(false);
};

// Set mock filters for testing
export const setMockFilters = (filters: BlogFilters) => {
  mockFilters = filters;
};

// Configure mock isFilterActive for testing
export const setMockIsFilterActive = (returnValue: boolean) => {
  mockIsFilterActive.mockReturnValue(returnValue);
};

// Configure updateFilters implementation
export const setMockUpdateFiltersImpl = (implementation: (newFilters: Partial<BlogFilters>) => void) => {
  mockUpdateFilters.mockImplementation(implementation);
};

// Default export
export default useFilterPersistence; 