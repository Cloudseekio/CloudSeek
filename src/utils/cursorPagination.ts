import { useCallback, useRef, useState } from 'react';

export interface CursorPaginationOptions<T> {
  // Function to fetch data using cursor
  fetchData: (params: {
    cursor?: string;
    direction: 'forward' | 'backward';
    limit: number;
  }) => Promise<{
    items: T[];
    nextCursor?: string;
    previousCursor?: string;
    hasMore: boolean;
  }>;
  // Number of items to fetch per page
  pageSize?: number;
  // Initial cursor (if starting from middle of dataset)
  initialCursor?: string;
  // Initial items (if available)
  initialItems?: T[];
  // Stable key function for items
  getItemKey: (item: T) => string;
  // Optional callbacks
  onError?: (error: Error) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
}

export interface CursorPaginationState<T> {
  // Current items in the list
  items: T[];
  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  isLoadingPrevious: boolean;
  // Error state
  error: Error | null;
  // Cursor states
  nextCursor: string | null;
  previousCursor: string | null;
  // Availability flags
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  // Actions
  loadMore: () => Promise<void>;
  loadPrevious: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

export function useCursorPagination<T>({
  fetchData,
  pageSize = 20,
  initialCursor,
  initialItems = [],
  getItemKey,
  onError,
  onLoadStart,
  onLoadEnd,
}: CursorPaginationOptions<T>): CursorPaginationState<T> {
  // State management
  const [items, setItems] = useState<T[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Cursor management
  const nextCursorRef = useRef<string | null>(null);
  const previousCursorRef = useRef<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPreviousPage, setHasPreviousPage] = useState(!!initialCursor);

  // Cache management
  const itemCache = useRef(new Map<string, T>());
  const cursorCache = useRef(new Map<string, string>());

  // Initialize cache with initial items
  if (initialItems.length > 0 && itemCache.current.size === 0) {
    initialItems.forEach(item => {
      const key = getItemKey(item);
      itemCache.current.set(key, item);
    });
  }

  // Helper to update cache
  const updateCache = useCallback((newItems: T[]) => {
    newItems.forEach((item, index) => {
      const key = getItemKey(item);
      itemCache.current.set(key, item);
      
      // Store cursor relationships
      if (index > 0) {
        const prevKey = getItemKey(newItems[index - 1]);
        cursorCache.current.set(prevKey, key);
      }
    });
  }, [getItemKey]);

  // Load more items
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasNextPage) return;
    
    try {
      setIsLoadingMore(true);
      onLoadStart?.();
      setError(null);

      const result = await fetchData({
        cursor: nextCursorRef.current || undefined,
        direction: 'forward',
        limit: pageSize,
      });

      updateCache(result.items);
      
      setItems(prevItems => [...prevItems, ...result.items]);
      nextCursorRef.current = result.nextCursor || null;
      setHasNextPage(result.hasMore);
      
      // Update previous cursor for first page
      if (!previousCursorRef.current && result.previousCursor) {
        previousCursorRef.current = result.previousCursor;
        setHasPreviousPage(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more items'));
      onError?.(err instanceof Error ? err : new Error('Failed to load more items'));
    } finally {
      setIsLoadingMore(false);
      onLoadEnd?.();
    }
  }, [fetchData, pageSize, isLoadingMore, hasNextPage, updateCache, onLoadStart, onLoadEnd, onError]);

  // Load previous items
  const loadPrevious = useCallback(async () => {
    if (isLoadingPrevious || !hasPreviousPage) return;
    
    try {
      setIsLoadingPrevious(true);
      onLoadStart?.();
      setError(null);

      const result = await fetchData({
        cursor: previousCursorRef.current || undefined,
        direction: 'backward',
        limit: pageSize,
      });

      updateCache(result.items);
      
      setItems(prevItems => [...result.items, ...prevItems]);
      previousCursorRef.current = result.previousCursor || null;
      setHasPreviousPage(result.hasMore);
      
      // Update next cursor for last page
      if (!nextCursorRef.current && result.nextCursor) {
        nextCursorRef.current = result.nextCursor;
        setHasNextPage(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load previous items'));
      onError?.(err instanceof Error ? err : new Error('Failed to load previous items'));
    } finally {
      setIsLoadingPrevious(false);
      onLoadEnd?.();
    }
  }, [fetchData, pageSize, isLoadingPrevious, hasPreviousPage, updateCache, onLoadStart, onLoadEnd, onError]);

  // Refresh the current view
  const refresh = useCallback(async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      onLoadStart?.();
      setError(null);

      const result = await fetchData({
        cursor: undefined,
        direction: 'forward',
        limit: pageSize,
      });

      // Clear caches
      itemCache.current.clear();
      cursorCache.current.clear();
      
      updateCache(result.items);
      
      setItems(result.items);
      nextCursorRef.current = result.nextCursor || null;
      previousCursorRef.current = result.previousCursor || null;
      setHasNextPage(result.hasMore);
      setHasPreviousPage(!!result.previousCursor);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh items'));
      onError?.(err instanceof Error ? err : new Error('Failed to refresh items'));
    } finally {
      setIsLoading(false);
      onLoadEnd?.();
    }
  }, [fetchData, pageSize, isLoading, updateCache, onLoadStart, onLoadEnd, onError]);

  // Reset to initial state
  const reset = useCallback(() => {
    setItems(initialItems);
    setIsLoading(false);
    setIsLoadingMore(false);
    setIsLoadingPrevious(false);
    setError(null);
    nextCursorRef.current = null;
    previousCursorRef.current = initialCursor || null;
    setHasNextPage(true);
    setHasPreviousPage(!!initialCursor);
    itemCache.current.clear();
    cursorCache.current.clear();
    
    // Reinitialize cache with initial items
    if (initialItems.length > 0) {
      updateCache(initialItems);
    }
  }, [initialItems, initialCursor, updateCache]);

  return {
    items,
    isLoading,
    isLoadingMore,
    isLoadingPrevious,
    error,
    nextCursor: nextCursorRef.current,
    previousCursor: previousCursorRef.current,
    hasNextPage,
    hasPreviousPage,
    loadMore,
    loadPrevious,
    refresh,
    reset,
  };
} 