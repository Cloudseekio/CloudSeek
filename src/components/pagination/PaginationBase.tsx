import React from 'react';
import { cn } from '../../utils/cn';

export type PaginationType = 'traditional' | 'infinite' | 'virtual' | 'loadMore';

export interface PaginationBaseProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number, itemsPerPage?: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  paginationType?: PaginationType;
  className?: string;
  loading?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  showPageSize?: boolean;
  showJumpToPage?: boolean;
  pageSizeOptions?: number[];
}

export interface PaginationState {
  jumpToPage: string;
  isJumpToPageValid: boolean;
}

export const PaginationBase: React.FC<PaginationBaseProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
  paginationType = 'traditional',
  className = '',
  loading = false,
  hasNextPage = false,
  onLoadMore,
  loadingMore = false,
  showPageSize = true,
  showJumpToPage = true,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const [state, setState] = React.useState<PaginationState>({
    jumpToPage: '',
    isJumpToPageValid: true,
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value, 10);
    onItemsPerPageChange?.(newPageSize);
    // Reset to first page when changing page size
    onPageChange(1, newPageSize);
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(state.jumpToPage, 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
      setState(prev => ({ ...prev, jumpToPage: '', isJumpToPageValid: true }));
    } else {
      setState(prev => ({ ...prev, isJumpToPageValid: false }));
    }
  };

  const handleJumpToPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      jumpToPage: e.target.value,
      isJumpToPageValid: true,
    });
  };

  if (totalItems === 0) return null;

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      {/* Page size selector */}
      {showPageSize && paginationType === 'traditional' && (
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600">
            Items per page:
          </label>
          <select
            id="pageSize"
            value={itemsPerPage}
            onChange={handlePageSizeChange}
            disabled={loading}
            className={cn(
              'px-2 py-1 text-sm border rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Jump to page input */}
      {showJumpToPage && paginationType === 'traditional' && (
        <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
          <label htmlFor="jumpToPage" className="text-sm text-gray-600">
            Go to page:
          </label>
          <input
            id="jumpToPage"
            type="number"
            min={1}
            max={totalPages}
            value={state.jumpToPage}
            onChange={handleJumpToPageChange}
            className={cn(
              'w-16 px-2 py-1 text-sm border rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-blue-500',
              !state.isJumpToPageValid && 'border-red-500',
              loading && 'opacity-50 cursor-not-allowed'
            )}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !state.jumpToPage}
            className={cn(
              'px-3 py-1 text-sm text-white bg-blue-600 rounded-md',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
              (loading || !state.jumpToPage) && 'opacity-50 cursor-not-allowed'
            )}
          >
            Go
          </button>
        </form>
      )}

      {/* Load more button for load more pagination type */}
      {paginationType === 'loadMore' && hasNextPage && (
        <button
          onClick={onLoadMore}
          disabled={loading || loadingMore}
          className={cn(
            'w-full sm:w-auto px-4 py-2 text-sm text-white bg-blue-600 rounded-md',
            'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
            (loading || loadingMore) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {loadingMore ? 'Loading...' : 'Load More'}
        </button>
      )}

      {/* Page info */}
      <div className="text-sm text-gray-600">
        {paginationType === 'traditional' && (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
        {(paginationType === 'infinite' || paginationType === 'loadMore') && (
          <span>
            Showing {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
          </span>
        )}
      </div>
    </div>
  );
}; 