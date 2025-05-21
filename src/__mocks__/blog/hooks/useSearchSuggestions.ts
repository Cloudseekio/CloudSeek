import { BlogPost } from '../../../blog/types/blog';

// Default mock state
let mockSuggestions: string[] = [];
let mockLoading = false;

/**
 * Mock implementation of useSearchSuggestions
 */
export const useSearchSuggestions = jest.fn().mockImplementation(
  (searchTerm: string, posts: BlogPost[]) => {
    // Simple implementation that returns post titles that match the search term
    if (searchTerm.length >= 2) {
      mockSuggestions = posts
        .filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(post => post.title);
    } else {
      mockSuggestions = [];
    }

    return {
      suggestions: mockSuggestions,
      loading: mockLoading
    };
  }
);

// Helper functions for testing
export const setMockSuggestions = (suggestions: string[]) => {
  mockSuggestions = [...suggestions];
};

export const setMockLoading = (loading: boolean) => {
  mockLoading = loading;
};

export const resetMockState = () => {
  mockSuggestions = [];
  mockLoading = false;
};

export default useSearchSuggestions; 