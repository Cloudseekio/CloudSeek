import React from 'react';
import { cn } from '../../utils/cn';
import { BiDirectionalInfiniteScroll } from './BiDirectionalInfiniteScroll';
import { CursorPaginationOptions, useCursorPagination } from '../../utils/cursorPagination';

export interface CursorPaginationProps<T> extends Omit<CursorPaginationOptions<T>, 'onLoadStart' | 'onLoadEnd'> {
  // Render function for items
  renderItem: (item: T) => React.ReactNode;
  // Optional props
  className?: string;
  loadingIndicator?: React.ReactNode;
  emptyMessage?: string;
  errorMessage?: string;
  // Scroll behavior
  threshold?: number;
  minDistance?: number;
  preserveScrollPosition?: boolean;
  disableScrollWhileLoading?: boolean;
  // Container customization
  scrollContainer?: HTMLElement | null;
  containerClassName?: string;
}

export function CursorPagination<T>({
  renderItem,
  className,
  loadingIndicator,
  emptyMessage = 'No items found',
  errorMessage = 'Failed to load items',
  threshold = 0.8,
  minDistance = 100,
  preserveScrollPosition = true,
  disableScrollWhileLoading = true,
  scrollContainer = null,
  containerClassName,
  ...options
}: CursorPaginationProps<T>) {
  const {
    items,
    isLoading,
    isLoadingMore,
    isLoadingPrevious,
    error,
    hasNextPage,
    hasPreviousPage,
    loadMore,
    loadPrevious,
    refresh,
  } = useCursorPagination(options);

  // Default loading indicator
  const defaultLoadingIndicator = (
    <div className="flex justify-center p-4">
      <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  );

  // Error display
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-600">
        <p>{errorMessage}</p>
        <button
          onClick={() => refresh()}
          className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (!isLoading && items.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  // Initial loading state
  if (isLoading && items.length === 0) {
    return loadingIndicator || defaultLoadingIndicator;
  }

  return (
    <div className={cn('relative', className)}>
      <BiDirectionalInfiniteScroll
        onLoadMore={loadMore}
        onLoadPrevious={loadPrevious}
        isLoadingMore={isLoadingMore}
        isLoadingPrevious={isLoadingPrevious}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        threshold={threshold}
        loadingIndicator={loadingIndicator || defaultLoadingIndicator}
        className={containerClassName}
        scrollContainer={scrollContainer}
        preserveScrollPosition={preserveScrollPosition}
        minDistance={minDistance}
        disableScrollWhileLoading={disableScrollWhileLoading}
      >
        <div className="space-y-4">
          {items.map(item => (
            <div key={options.getItemKey(item)}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      </BiDirectionalInfiniteScroll>
    </div>
  );
} 