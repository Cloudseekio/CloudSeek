import { 
  useState, 
  useEffect, 
  useLayoutEffect, 
  useCallback 
} from 'react';
import type { 
  EffectCallback, 
  DependencyList, 
  Dispatch, 
  SetStateAction 
} from 'react';

/**
 * Helper to check if code is running in a browser environment
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Type for useState hook return
 */
export type SafeStateHook<T> = [T, Dispatch<SetStateAction<T>>];

/**
 * Safe version of useState that works in any environment
 * @param initialState Initial state or function that returns initial state
 * @returns State and setState function
 */
export function useSafeState<T>(initialState: T | (() => T)): SafeStateHook<T> {
  return useState<T>(initialState);
}

/**
 * Safe version of useEffect that only runs the effect in browser environments
 * @param effect Effect callback function
 * @param deps Effect dependencies
 */
export function useSafeEffect(
  effect: EffectCallback,
  deps?: DependencyList
): void {
  useEffect(() => {
    if (isBrowser) {
      return effect();
    }
    return undefined;
  }, deps);
}

/**
 * Safe version of useLayoutEffect that falls back to useEffect in non-browser environments
 * @param effect Effect callback function
 * @param deps Effect dependencies
 */
export function useSafeLayoutEffect(
  effect: EffectCallback,
  deps?: DependencyList
): void {
  // In non-browser environments, useLayoutEffect logs a warning, so we use useEffect instead
  const useEffectToUse = isBrowser ? useLayoutEffect : useEffect;
  
  useEffectToUse(() => {
    if (isBrowser) {
      return effect();
    }
    return undefined;
  }, deps);
}

/**
 * Hook for safely accessing window size
 * @returns Current window dimensions or default values in non-browser environments
 */
export function useWindowSize() {
  const getSize = useCallback(() => {
    if (!isBrowser) {
      return { width: 0, height: 0 };
    }
    
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }, []);
  
  const [size, setSize] = useSafeState(getSize);
  
  useSafeEffect(() => {
    const handleResize = () => {
      setSize(getSize());
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [getSize]);
  
  return size;
}

/**
 * Hook for safely accessing localStorage
 * @param key Storage key
 * @param initialValue Default value
 * @returns Value and setter function
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = useCallback((): T => {
    if (!isBrowser) {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);
  
  const [storedValue, setStoredValue] = useSafeState<T>(readValue);
  
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    if (!isBrowser) {
      console.warn(`Tried setting localStorage key "${key}" in a non-browser environment`);
      return;
    }
    
    try {
      const valueToStore = 
        value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  // Sync with other tabs/windows
  useSafeEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== key) return;
      
      try {
        const newValue = e.newValue ? JSON.parse(e.newValue) as T : initialValue;
        setStoredValue(newValue);
      } catch (error) {
        console.warn(`Error parsing storage change for key "${key}":`, error);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);
  
  return [storedValue, setValue] as const;
}

/**
 * Hook for safely accessing sessionStorage
 * @param key Storage key
 * @param initialValue Default value
 * @returns Value and setter function
 */
export function useSessionStorage<T>(key: string, initialValue: T) {
  const readValue = React.useCallback((): T => {
    if (!isBrowser) {
      return initialValue;
    }
    
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);
  
  const [storedValue, setStoredValue] = useSafeState<T>(readValue);
  
  const setValue = React.useCallback((value: T | ((val: T) => T)) => {
    if (!isBrowser) {
      console.warn(`Tried setting sessionStorage key "${key}" in a non-browser environment`);
      return;
    }
    
    try {
      const valueToStore = 
        value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue] as const;
}

/**
 * Hook for safely checking media queries
 * @param query Media query string
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const getMatches = React.useCallback(() => {
    if (!isBrowser) {
      return false;
    }
    
    return window.matchMedia(query).matches;
  }, [query]);
  
  const [matches, setMatches] = useSafeState(getMatches);
  
  useSafeEffect(() => {
    if (!isBrowser) {
      return;
    }
    
    const mediaQuery = window.matchMedia(query);
    
    // Initial check
    setMatches(mediaQuery.matches);
    
    // Create event listener
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    // Use modern API if available
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      // @ts-ignore - older browsers use this
      mediaQuery.addListener(handler);
      // @ts-ignore - older browsers use this
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);
  
  return matches;
}

/**
 * Hook for safely checking if device is online
 * @returns Whether the device is online
 */
export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useSafeState(() => {
    return isBrowser ? navigator.onLine : true;
  });
  
  useSafeEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}

/**
 * Hook for safely checking if the app is in installed (standalone) mode
 * @returns Whether the app is running in standalone mode
 */
export function useStandaloneMode(): boolean {
  return useSafeState(() => {
    if (!isBrowser) return false;
    
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-ignore - navigator.standalone is Safari-specific
      (navigator.standalone === true) ||
      document.referrer.includes('android-app://')
    );
  })[0];
}

/**
 * Types for the scroll hook
 */
export interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Hook for safely tracking scroll position
 * @returns Current scroll position
 */
export function useScrollPosition(): ScrollPosition {
  const [position, setPosition] = useSafeState<ScrollPosition>({
    x: isBrowser ? window.scrollX : 0,
    y: isBrowser ? window.scrollY : 0
  });
  
  useSafeEffect(() => {
    const handleScroll = () => {
      setPosition({
        x: window.scrollX,
        y: window.scrollY
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return position;
}

/**
 * Default export with all hooks
 */
export default {
  useSafeState,
  useSafeEffect,
  useSafeLayoutEffect,
  useWindowSize,
  useLocalStorage,
  useSessionStorage,
  useMediaQuery,
  useOnlineStatus,
  useStandaloneMode,
  useScrollPosition,
  isBrowser
}; 