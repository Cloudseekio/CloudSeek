import React, { createContext, useCallback, useContext, useState } from 'react';

interface LoadingContextValue {
  isLoading: boolean;
  loadingKeys: Set<string>;
  setLoading: (loading: boolean, key?: string) => void;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());

  const setLoading = useCallback((loading: boolean, key?: string) => {
    setLoadingKeys(current => {
      const updated = new Set(current);
      if (loading && key) {
        updated.add(key);
      } else if (!loading && key) {
        updated.delete(key);
      }
      return updated;
    });
  }, []);

  const value = {
    isLoading: loadingKeys.size > 0,
    loadingKeys,
    setLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
} 