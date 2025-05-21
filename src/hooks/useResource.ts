import { useState, useEffect, useCallback } from 'react';
import { loadResource, type ResourceOptions } from '../utils/resourceOptimization';
import logger from '../utils/logger';

export interface UseResourceOptions<T> extends ResourceOptions {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  dependencies?: unknown[];
}

export interface UseResourceResult<T> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook for loading and managing resources with caching
 */
export function useResource<T>(
  url: string | null,
  options: UseResourceOptions<T> = {}
): UseResourceResult<T> {
  const {
    initialData,
    onSuccess,
    onError,
    dependencies = [],
    ...resourceOptions
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);

  const fetchResource = useCallback(async () => {
    if (!url) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await loadResource<T>(url, resourceOptions);
      setData(result);
      onSuccess?.(result);
      logger.debug('Resource loaded successfully:', { url });
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
      logger.error('Failed to load resource:', { url, error: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [url, ...dependencies]);

  useEffect(() => {
    fetchResource();
  }, [fetchResource]);

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
    refetch: fetchResource
  };
}

/**
 * Hook for loading multiple resources in parallel
 */
export function useResources<T>(
  urls: (string | null)[],
  options: Omit<UseResourceOptions<T[]>, 'initialData'> & { initialData?: T[] } = {}
): UseResourceResult<T[]> {
  const {
    initialData = [],
    onSuccess,
    onError,
    dependencies = [],
    ...resourceOptions
  } = options;

  const [data, setData] = useState<T[]>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData.length);

  const fetchResources = useCallback(async () => {
    const validUrls = urls.filter((url): url is string => url !== null);
    if (!validUrls.length) return;

    setIsLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        validUrls.map(url => loadResource<T>(url, resourceOptions))
      );
      setData(results);
      onSuccess?.(results);
      logger.debug('Resources loaded successfully:', { urls: validUrls });
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
      logger.error('Failed to load resources:', { urls: validUrls, error: error.message });
    } finally {
      setIsLoading(false);
    }
  }, [urls.join(','), ...dependencies]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
    refetch: fetchResources
  };
} 