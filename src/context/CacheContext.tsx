import React, { createContext, useContext, ReactNode } from 'react';
import { CacheService } from '../services/CacheService';

interface CacheContextValue {
  defaultMaxSize: number;
  defaultMaxAge: number;
  globalCache: CacheService;
}

const CacheContext = createContext<CacheContextValue | undefined>(undefined);

interface CacheProviderProps {
  children: ReactNode;
  defaultMaxSize?: number;
  defaultMaxAge?: number;
}

export const CacheProvider: React.FC<CacheProviderProps> = ({
  children,
  defaultMaxSize = 50 * 1024 * 1024, // 50MB
  defaultMaxAge = 5 * 60 * 1000 // 5 minutes
}) => {
  const globalCache = new CacheService(defaultMaxSize);
  
  const value: CacheContextValue = {
    defaultMaxSize,
    defaultMaxAge,
    globalCache
  };
  
  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
};

export function useCacheContext(): CacheContextValue {
  const context = useContext(CacheContext);
  
  if (!context) {
    throw new Error('useCacheContext must be used within a CacheProvider');
  }
  
  return context;
}

// Example usage:
/*
function App() {
  return (
    <CacheProvider defaultMaxSize={100 * 1024 * 1024} defaultMaxAge={10 * 60 * 1000}>
      <MyComponent />
    </CacheProvider>
  );
}

function MyComponent() {
  const { globalCache, defaultMaxAge } = useCacheContext();
  
  useEffect(() => {
    const data = globalCache.get('key');
    if (!data) {
      globalCache.set('key', newData, { maxAge: defaultMaxAge });
    }
  }, [globalCache, defaultMaxAge]);
  
  return <div>...</div>;
}
*/ 