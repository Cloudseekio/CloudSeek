import React, { useState, useMemo, useCallback } from 'react';
import { cn } from '../../utils/cn';

export interface PaginationProps {
  // Required props
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  
  // Optional props
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  siblingCount?: number;
  showJumpToPage?: boolean;
  showPageSize?: boolean;
  className?: string;
  
  // Labels and text
  previousLabel?: string;
  nextLabel?: string;
  pageSizeLabel?: string;
  jumpToPageLabel?: string;
  
  // Loading state
  isLoading?: boolean;
}

export function TraditionalPagination({
  totalItems,
  currentPage,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  siblingCount = 1,
  showJumpToPage = true,
  showPageSize = true,
  className,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  pageSizeLabel = 'Items per page:',
  jumpToPageLabel = 'Go to page:',
  isLoading = false,
}: PaginationProps) {
  // Local state for jump to page input
  const [jumpToPageValue, setJumpToPageValue] = useState('');

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);

  // Generate page numbers array with ellipsis
  const pageNumbers = useMemo(() => {
    const range = (start: number, end: number) => 
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const totalNumbers = siblingCount * 2 + 3; // siblings + first + last + current
    const totalBlocks = totalNumbers + 2; // +2 for dots

  if (totalPages <= totalBlocks) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return [...range(1, leftItemCount), -1, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return [1, -2, ...range(totalPages - rightItemCount + 1, totalPages)];
    }

    return [
      1,
      -2,
      ...range(leftSiblingIndex, rightSiblingIndex),
      -1,
      totalPages,
    ];
  }, [currentPage, totalPages, siblingCount]);

  // Handle page size change
  const handlePageSizeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    const newCurrentPage = Math.ceil((currentPage * pageSize) / newPageSize);
    onPageSizeChange?.(newPageSize);
    onPageChange(newCurrentPage);
  }, [currentPage, pageSize, onPageChange, onPageSizeChange]);

  // Handle jump to page
  const handleJumpToPage = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    const page = parseInt(jumpToPageValue, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpToPageValue('');
    }
  }, [jumpToPageValue, totalPages, onPageChange]);

  // Get button styles based on state
  const getPageButtonStyles = (isActive: boolean) => cn(
    'px-3 py-2 text-sm font-medium rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-gray-700 hover:bg-gray-50',
    isLoading && 'opacity-50 cursor-not-allowed'
  );

  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      {/* Page size selector */}
      {showPageSize && onPageSizeChange && (
        <div className="flex items-center space-x-2">
          <label htmlFor="pageSize" className="text-sm text-gray-700">
            {pageSizeLabel}
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            disabled={isLoading}
            className={cn(
              'block w-full rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500',
              isLoading && 'opacity-50 cursor-not-allowed'
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

      {/* Pagination controls */}
      <div className="flex items-center justify-center space-x-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={getPageButtonStyles(false)}
          aria-label={previousLabel}
        >
          {previousLabel}
        </button>

        {/* Page numbers */}
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber < 0) {
      return (
        <span
                key={index}
                className="px-3 py-2 text-sm text-gray-700"
          aria-hidden="true"
        >
          ...
        </span>
      );
    }

    return (
      <button
              key={index}
        onClick={() => onPageChange(pageNumber)}
              disabled={isLoading}
              className={getPageButtonStyles(pageNumber === currentPage)}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
      >
        {pageNumber}
      </button>
    );
        })}

        {/* Next button */}
          <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={getPageButtonStyles(false)}
          aria-label={nextLabel}
        >
          {nextLabel}
          </button>
        </div>

      {/* Jump to page form */}
      {showJumpToPage && (
        <form onSubmit={handleJumpToPage} className="flex items-center space-x-2">
          <label htmlFor="jumpToPage" className="text-sm text-gray-700">
            {jumpToPageLabel}
          </label>
          <input
            id="jumpToPage"
            type="number"
            min={1}
            max={totalPages}
            value={jumpToPageValue}
            onChange={(e) => setJumpToPageValue(e.target.value)}
            disabled={isLoading}
            className={cn(
              'block w-20 rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
          />
          <button
            type="submit"
            disabled={!jumpToPageValue || isLoading}
            className={cn(
              'px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
              (!jumpToPageValue || isLoading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            Go
          </button>
        </form>
        )}
    </div>
  );
} 