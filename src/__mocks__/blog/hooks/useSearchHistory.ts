// Mock state
let mockHistory: string[] = ['react', 'testing', 'javascript'];
const mockAddToHistory = jest.fn();
const mockRemoveFromHistory = jest.fn();
const mockClearHistory = jest.fn();

/**
 * Mock implementation of useSearchHistory
 */
export const useSearchHistory = jest.fn().mockImplementation(() => {
  return {
    history: mockHistory,
    addToHistory: mockAddToHistory,
    removeFromHistory: mockRemoveFromHistory,
    clearHistory: mockClearHistory
  };
});

// Helper functions for testing
export const resetMockHistory = () => {
  mockHistory = ['react', 'testing', 'javascript'];
  mockAddToHistory.mockClear();
  mockRemoveFromHistory.mockClear();
  mockClearHistory.mockClear();
};

export const setMockHistory = (history: string[]) => {
  mockHistory = [...history];
};

export const implementMockAddToHistory = (implementation: (term: string) => void) => {
  mockAddToHistory.mockImplementation(implementation);
};

export const implementMockRemoveFromHistory = (implementation: (term: string) => void) => {
  mockRemoveFromHistory.mockImplementation(implementation);
};

export const implementMockClearHistory = (implementation: () => void) => {
  mockClearHistory.mockImplementation(implementation);
};

export default useSearchHistory; 