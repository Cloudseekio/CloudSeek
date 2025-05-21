import { useState, useCallback } from 'react';
import { useBatchRequests } from '../utils/requestBatching';

export interface PaginationParams {
  page: number;
  limit: number;
  cursor?: string;
  filters?: Record<string, unknown>;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  nextCursor?: string;
  currentPage: number;
  totalPages: number;
}

export interface BatchedPaginationOptions<T> {
  // Function to fetch paginated data
  fetchData: (params: PaginationParams[]) => Promise<PaginatedResponse<T>[]>;
  // Initial page size
  pageSize?: number;
  // Initial filters
  initialFilters?: Record<string, unknown>;
  // Initial sort
  initialSort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  // Batch options
  batchOptions?: {
    maxBatchSize?: number;
    maxWaitTime?: number;
    cacheTTL?: number;
  };
}

export function useBatchedPagination<T>({
  fetchData,
  pageSize = 20,
  initialFilters = {},
  initialSort,
  batchOptions = {},
}: BatchedPaginationOptions<T>) {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState(initialSort);
  const [data, setData] = useState<PaginatedResponse<T> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize request batching
  const { addRequest } = useBatchRequests<PaginationParams, PaginatedResponse<T>>({
    process: async (requests) => {
      try {
        return await fetchData(requests);
      } catch {
        throw new Error('Failed to fetch data');
      }
    },
    getCacheKey: (params) => {
      return JSON.stringify({
        page: params.page,
        limit: params.limit,
        filters: params.filters,
        sort: params.sort,
        cursor: params.cursor,
      });
    },
    ...batchOptions,
  });

  // Load page
  const loadPage = useCallback(async (
    page: number,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await addRequest(
        {
          page,
          limit: pageSize,
          filters,
          sort,
        },
        priority
      );

      setData(response);
      setCurrentPage(page);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [addRequest, pageSize, filters, sort]);

  // Load multiple pages
  const loadPages = useCallback(async (
    pages: number[],
    priority: 'high' | 'medium' | 'low' = 'medium'
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const requests = pages.map(page => addRequest(
        {
          page,
          limit: pageSize,
          filters,
          sort,
        },
        priority
      ));

      await Promise.all(requests);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [addRequest, pageSize, filters, sort]);

  // Prefetch pages
  const prefetchPages = useCallback((pages: number[]) => {
    void loadPages(pages, 'low');
  }, [loadPages]);

  // Update filters
  const updateFilters = useCallback((newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    void loadPage(1, 'high');
  }, [loadPage]);

  // Update sort
  const updateSort = useCallback((
    field: string,
    direction: 'asc' | 'desc'
  ) => {
    setSort({ field, direction });
    void loadPage(1, 'high');
  }, [loadPage]);

  // Navigation helpers
  const goToPage = useCallback((page: number) => {
    void loadPage(page, 'high');
  }, [loadPage]);

  const goToNextPage = useCallback(() => {
    if (data && currentPage < data.totalPages) {
      void loadPage(currentPage + 1, 'high');
    }
  }, [data, currentPage, loadPage]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      void loadPage(currentPage - 1, 'high');
    }
  }, [currentPage, loadPage]);

  return {
    // Data
    data,
    currentPage,
    isLoading,
    error,
    // Filters and sorting
    filters,
    sort,
    updateFilters,
    updateSort,
    // Navigation
    goToPage,
    goToNextPage,
    goToPreviousPage,
    // Advanced features
    loadPages,
    prefetchPages,
  };
} 