# React Hooks Best Practices Guide

## Table of Contents
- [Introduction](#introduction)
- [Common Issues with React Hooks](#common-issues-with-react-hooks)
- [Best Practices](#best-practices)
- [Safe Patterns for Browser APIs](#safe-patterns-for-browser-apis)
- [Example Implementations](#example-implementations)
- [Testing Hooks](#testing-hooks)
- [TypeScript and Hooks](#typescript-and-hooks)

## Introduction

This guide provides best practices for using React hooks, especially in applications that may render in non-browser environments (like server-side rendering) or where hooks may be called in contexts where browser APIs are not available.

## Common Issues with React Hooks

### The "Cannot read properties of null" Error

One of the most common errors developers encounter is:

```
TypeError: Cannot read properties of null (reading 'useState')
```

This typically happens when:
1. React hooks are used outside of React's rendering context
2. Browser APIs are accessed directly in hook initializers without environment checks
3. React is not properly initialized before hooks are called

## Best Practices

### 1. Import React Correctly

**Bad:**
```jsx
import React, { useState, useEffect } from 'react';
```

**Good:**
```jsx
import * as React from 'react';
const { useState, useEffect } = React;
```

This ensures hooks are accessed through the React namespace, reducing the risk of "Cannot read properties of null" errors.

### 2. Check Environment Before Using Browser APIs

**Bad:**
```jsx
const [isOnline, setIsOnline] = useState(window.navigator.onLine);
```

**Good:**
```jsx
const isBrowser = typeof window !== 'undefined';
const [isOnline, setIsOnline] = useState(isBrowser ? window.navigator.onLine : true);
```

### 3. Use Safe Hook Wrappers

Create wrapper hooks that handle environment checks:

```jsx
function useSafeState<T>(initialState: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  return React.useState(initialState);
}

function useSafeEffect(effect: React.EffectCallback, deps?: React.DependencyList) {
  const isBrowser = typeof window !== 'undefined';
  
  React.useEffect(() => {
    if (isBrowser) {
      return effect();
    }
    return undefined;
  }, deps);
}
```

### 4. Lazy Initialization for Expensive Operations

**Bad:**
```jsx
const [data, setData] = useState(expensiveCalculation());
```

**Good:**
```jsx
const [data, setData] = useState(() => expensiveCalculation());
```

## Safe Patterns for Browser APIs

### Window Object

```jsx
const useWindowSize = () => {
  const isBrowser = typeof window !== 'undefined';
  
  const getSize = React.useCallback(() => {
    if (!isBrowser) {
      return { width: 0, height: 0 };
    }
    
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }, [isBrowser]);
  
  const [size, setSize] = React.useState(getSize);
  
  React.useEffect(() => {
    if (!isBrowser) return;
    
    const handleResize = () => setSize(getSize());
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isBrowser, getSize]);
  
  return size;
};
```

### Local Storage

```jsx
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const isBrowser = typeof window !== 'undefined';
  
  const storedValue = React.useMemo(() => {
    if (!isBrowser) return initialValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  }, [key, initialValue, isBrowser]);
  
  const [value, setValue] = React.useState<T>(storedValue);
  
  React.useEffect(() => {
    if (!isBrowser) return;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key, value, isBrowser]);
  
  return [value, setValue] as const;
};
```

## Example Implementations

### Safe PWA Hook

```tsx
export interface UseSafePWAReturn {
  isOnline: boolean;
  canInstall: boolean;
  isStandalone: boolean;
  installApp: () => Promise<void>;
}

export const useSafePWA = (): UseSafePWAReturn => {
  const isBrowser = typeof window !== 'undefined';
  
  // Default return value for non-browser environments
  if (!isBrowser) {
    return {
      isOnline: true,
      canInstall: false,
      isStandalone: false,
      installApp: async () => { /* no-op */ }
    };
  }
  
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [canInstall, setCanInstall] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isStandalone, setIsStandalone] = React.useState(
    window.matchMedia('(display-mode: standalone)').matches
  );
  
  // Set up event handlers
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    });
    
    window.addEventListener('appinstalled', () => {
      setCanInstall(false);
      setDeferredPrompt(null);
    });
    
    const mediaQueryList = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => setIsStandalone(e.matches);
    
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      }
    };
  }, []);
  
  const installApp = async () => {
    if (!deferredPrompt) return;
    
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the installation prompt');
      } else {
        console.log('User dismissed the installation prompt');
      }
      
      setDeferredPrompt(null);
      setCanInstall(false);
    } catch (error) {
      console.error('Error installing app:', error);
    }
  };
  
  return { isOnline, canInstall, isStandalone, installApp };
};
```

## Testing Hooks

When testing hooks that rely on browser APIs:

```jsx
describe('useSafePWA', () => {
  const originalWindow = { ...window };
  
  beforeEach(() => {
    // Mock browser APIs for testing
    Object.defineProperty(window, 'navigator', {
      value: { onLine: true },
      writable: true
    });
    
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      })),
      writable: true
    });
  });
  
  afterEach(() => {
    // Restore window to original state
    Object.defineProperty(window, 'navigator', {
      value: originalWindow.navigator,
      writable: true
    });
    
    Object.defineProperty(window, 'matchMedia', {
      value: originalWindow.matchMedia,
      writable: true
    });
  });
  
  it('should handle online status correctly', () => {
    // Test implementation
  });
});
```

## TypeScript and Hooks

TypeScript can help catch issues with hooks by enforcing correct types:

```tsx
type BrowserSafeState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

function useBrowserSafeState<T>(initialState: T | (() => T)): BrowserSafeState<T> {
  const isBrowser = typeof window !== 'undefined';
  const [state, setState] = React.useState<T>(
    typeof initialState === 'function' && isBrowser 
      ? (initialState as () => T)() 
      : initialState
  );
  
  return [state, setState];
}
```

By following these best practices, you can avoid common issues with React hooks and ensure your application works correctly in all environments. 