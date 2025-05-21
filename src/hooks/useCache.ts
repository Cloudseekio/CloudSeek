import { useRef, useCallback } from 'react';
import { CacheService, CacheOptions } from '../services/CacheService';

const cacheInstances = new Map<string, CacheService>();

export function useCache(namespace: string, maxSize?: number) {
  const cacheRef = useRef<CacheService | undefined>(undefined);
  
  if (!cacheRef.current) {
    if (!cacheInstances.has(namespace)) {
      cacheInstances.set(namespace, new CacheService(maxSize));
    }
    cacheRef.current = cacheInstances.get(namespace)!;
  }
  
  const get = useCallback(<T>(key: string): T | null => {
    return cacheRef.current!.get<T>(key);
  }, []);
  
  const set = useCallback(<T>(key: string, value: T, options?: CacheOptions): void => {
    cacheRef.current!.set(key, value, options);
  }, []);
  
  const remove = useCallback((key: string): void => {
    cacheRef.current!.delete(key);
  }, []);
  
  const clear = useCallback((): void => {
    cacheRef.current!.clear();
  }, []);
  
  const getStats = useCallback(() => {
    return cacheRef.current!.getStats();
  }, []);
  
  const getFormattedStats = useCallback(() => {
    return cacheRef.current!.getFormattedStats();
  }, []);
  
  return {
    cache: cacheRef.current!,
    get,
    set,
    remove,
    clear,
    getStats,
    getFormattedStats
  };
} 