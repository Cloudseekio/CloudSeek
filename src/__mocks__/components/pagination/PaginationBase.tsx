import React from 'react';

// Define the props interface
export interface PaginationBaseProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number, itemsPerPage?: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  paginationType?: 'traditional' | 'infinite' | 'virtual' | 'loadMore';
  className?: string;
  loading?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  showPageSize?: boolean;
  showJumpToPage?: boolean;
  pageSizeOptions?: number[];
  children?: React.ReactNode;
}

// Mock implementation of PaginationBase
export const PaginationBase: React.FC<PaginationBaseProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
  children,
  loading = false,
  showPageSize = true,
  showJumpToPage = true,
  pageSizeOptions = [10, 20, 50, 100]
}) => {
  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <div data-testid="pagination-base">
      {/* Page size selector */}
      {showPageSize && onItemsPerPageChange && (
        <div data-testid="page-size-selector">
          <label htmlFor="pageSize">Items per page:</label>
          <select 
            id="pageSize"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            disabled={loading}
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      )}
      
      {/* Pagination children (usually buttons) */}
      <div data-testid="pagination-items">
        {children}
      </div>
      
      {/* Jump to page */}
      {showJumpToPage && (
        <div data-testid="jump-to-page">
          <label htmlFor="jumpToPage">Go to page:</label>
          <input 
            id="jumpToPage"
            type="number"
            min={1}
            max={totalPages}
            defaultValue={String(currentPage)}
            disabled={loading}
          />
          <button 
            onClick={() => {
              const input = document.getElementById('jumpToPage') as HTMLInputElement;
              const page = Number(input.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }} 
            disabled={loading}
          >
            Go
          </button>
        </div>
      )}
      
      {/* Page info */}
      <div data-testid="page-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default PaginationBase; 