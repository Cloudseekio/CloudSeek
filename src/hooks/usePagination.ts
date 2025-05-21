import { useState, useCallback, useEffect } from 'react';
import { useCache } from '../utils/cacheManager';

export interface PaginationOptions<T> {
  // Data fetching function
  fetchData: (params: {
    page: number;
    pageSize: number;
    filters?: Record<string, unknown>;
    sort?: { field: string; direction: 'asc' | 'desc' };
  }) => Promise<{
    items: T[];
    total: number;
  }>;
  // Initial state
  initialPage?: number;
  initialPageSize?: number;
  // Cache options
  cacheKey?: string;
  cacheTTL?: number;
  // Callbacks
  onError?: (error: Error) => void;
  onStateChange?: (state: PaginationState<T>) => void;
}

export interface PaginationState<T> {
  // Data
  items: T[];
  total: number;
  // Pagination state
  currentPage: number;
  pageSize: number;
  totalPages: number;
  // Loading state
  isLoading: boolean;
  error: Error | null;
  // Navigation state
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function usePagination<T>({
  fetchData,
  initialPage = 1,
  initialPageSize = 10,
  cacheKey = 'pagination',
  cacheTTL = 5 * 60 * 1000, // 5 minutes
  onError,
  onStateChange,
}: PaginationOptions<T>) {
  // Initialize cache
  const { get: getCache, set: setCache } = useCache({
    namespace: 'pagination',
    ttl: cacheTTL,
  });

  // State
  const [state, setState] = useState<PaginationState<T>>({
    items: [],
    total: 0,
    currentPage: initialPage,
    pageSize: initialPageSize,
    totalPages: 0,
    isLoading: true,
    error: null,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Load data with cache support
  const loadData = useCallback(async (
    page: number,
    pageSize: number,
    filters?: Record<string, unknown>,
    sort?: { field: string; direction: 'asc' | 'desc' }
  ) => {
    const cacheKeyWithParams = `${cacheKey}:${page}:${pageSize}:${JSON.stringify(filters)}:${JSON.stringify(sort)}`;
    
    try {
      // Check cache first
      const cachedData = await getCache<{ items: T[]; total: number }>(cacheKeyWithParams);
      if (cachedData) {
        const totalPages = Math.ceil(cachedData.total / pageSize);
        setState(prev => ({
          ...prev,
          items: cachedData.items,
          total: cachedData.total,
          currentPage: page,
          pageSize,
          totalPages,
          isLoading: false,
          error: null,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        }));
        return;
      }

      // Fetch fresh data
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { items, total } = await fetchData({ page, pageSize, filters, sort });
      
      // Cache the results
      await setCache(cacheKeyWithParams, { items, total });

      // Update state
      const totalPages = Math.ceil(total / pageSize);
      setState(prev => ({
        ...prev,
        items,
        total,
        currentPage: page,
        pageSize,
        totalPages,
        isLoading: false,
        error: null,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
      onError?.(error as Error);
    }
  }, [cacheKey, fetchData, getCache, setCache, onError]);

  // Initialize data
  useEffect(() => {
    void loadData(initialPage, initialPageSize);
  }, [initialPage, initialPageSize, loadData]);

  // Notify on state changes
  useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  // Navigation handlers
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      void loadData(page, state.pageSize);
    }
  }, [state.totalPages, state.pageSize, loadData]);

  const changePageSize = useCallback((newPageSize: number) => {
    const newPage = Math.ceil((state.currentPage * state.pageSize) / newPageSize);
    void loadData(newPage, newPageSize);
  }, [state.currentPage, state.pageSize, loadData]);

  const refresh = useCallback(() => {
    void loadData(state.currentPage, state.pageSize);
  }, [state.currentPage, state.pageSize, loadData]);

  return {
    // State
    ...state,
    // Actions
    goToPage,
    changePageSize,
    refresh,
    // Raw data loading
    loadData,
  };
} 