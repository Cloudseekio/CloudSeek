import React from 'react';
import { cn } from '../../utils/cn';
import { TraditionalPagination } from './TraditionalPagination';
import { usePagination, PaginationOptions } from '../../hooks/usePagination';
import { useDataCleanup } from '../../utils/dataCleanup';
import { normalizer } from '../../utils/stateNormalization';

export interface PaginatedListProps<T> extends Omit<PaginationOptions<T>, 'onStateChange'> {
  // Render function for items
  renderItem: (item: T) => React.ReactNode;
  // Optional props
  className?: string;
  loadingIndicator?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  errorMessage?: React.ReactNode;
  // Pagination UI options
  showPageSize?: boolean;
  showJumpToPage?: boolean;
  pageSizeOptions?: number[];
  // Layout options
  layout?: 'grid' | 'list';
  gridCols?: number;
  gap?: number;
}

export function PaginatedList<T extends { id: string }>({
  renderItem,
  className,
  loadingIndicator,
  emptyMessage = 'No items found',
  errorMessage = 'Failed to load items',
  showPageSize = true,
  showJumpToPage = true,
  pageSizeOptions = [10, 20, 50, 100],
  layout = 'list',
  gridCols = 3,
  gap = 4,
  ...paginationOptions
}: PaginatedListProps<T>) {
  // Setup data cleanup for paginated data
  const { registerData, accessData } = useDataCleanup<T[]>('paginated-items', {
    inactivityThreshold: 5 * 60 * 1000, // 5 minutes
    maxItems: 50,
    debug: true,
    cleanupOnUnmount: true
  });

  // Register schema for normalization
  React.useEffect(() => {
    normalizer.registerSchema<T>('items', {
      key: 'id'
    });
  }, []);

  // Use pagination hook with cleanup and normalization
  const {
    items,
    total,
    currentPage,
    pageSize,
    totalPages,
    isLoading,
    error,
    goToPage,
    changePageSize,
    refresh,
  } = usePagination({
    ...paginationOptions,
    fetchData: async (params) => {
      // Try to get cached data first
      const cachedData = accessData();
      if (cachedData) {
        const startIndex = (params.page - 1) * params.pageSize;
        const endIndex = startIndex + params.pageSize;
        const paginatedItems = cachedData.slice(startIndex, endIndex);
        
        return {
          items: paginatedItems,
          total: cachedData.length
        };
      }

      // Fetch new data
      const result = await paginationOptions.fetchData(params);

      // Normalize the data
      const normalizedState = normalizer.normalize('items', result.items);
      const denormalizedItems = normalizer.denormalize('items', normalizedState);

      // Store in cleanup manager
      registerData(denormalizedItems, {
        size: result.items.length,
        type: 'paginated-data'
      });

      return result;
    }
  });

  // Default loading indicator
  const defaultLoadingIndicator = (
    <div className="flex justify-center p-8">
      <div className="w-8 h-8 border-4 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-600">
        <p className="mb-4">{errorMessage}</p>
        <button
          onClick={refresh}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Loading state (initial load)
  if (isLoading && items.length === 0) {
    return loadingIndicator || defaultLoadingIndicator;
  }

  // Empty state
  if (!isLoading && items.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  // Grid layout styles
  const layoutStyles = layout === 'grid'
    ? `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${gridCols} gap-${gap}`
    : `flex flex-col gap-${gap}`;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Items */}
      <div className={layoutStyles}>
        {items.map((item, index) => (
          <div key={item.id} className="relative">
            {renderItem(item)}
          </div>
        ))}
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 rounded-full animate-spin border-t-transparent" />
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        </div>
      )}

      {/* Pagination controls */}
      <TraditionalPagination
        totalItems={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        pageSizeOptions={pageSizeOptions}
        showPageSize={showPageSize}
        showJumpToPage={showJumpToPage}
        isLoading={isLoading}
        className="pt-4 border-t"
      />
    </div>
  );
} 