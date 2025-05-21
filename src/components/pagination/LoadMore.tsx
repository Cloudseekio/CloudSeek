import React from 'react';
import { cn } from '../../utils/cn';
import { PaginationBase, PaginationBaseProps } from './PaginationBase';

export interface LoadMoreProps extends PaginationBaseProps {
  loadingIndicator?: React.ReactNode;
  loadMoreText?: string;
  loadingText?: string;
  children: React.ReactNode;
}

export const LoadMore: React.FC<LoadMoreProps> = ({
  loadingIndicator,
  loadMoreText = 'Load More',
  loadingText = 'Loading...',
  children,
  onLoadMore,
  loading = false,
  loadingMore = false,
  hasNextPage = false,
  className,
  ...rest
}) => {
  const defaultLoadingIndicator = (
    <div className="flex justify-center p-4">
      <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  );

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {children}
      
      {hasNextPage && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={loading || loadingMore}
            className={cn(
              'px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
              (loading || loadingMore) && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={loadingMore ? loadingText : loadMoreText}
          >
            {loadingMore ? loadingText : loadMoreText}
          </button>
        </div>
      )}

      {loadingMore && (loadingIndicator || defaultLoadingIndicator)}

      <PaginationBase
        loading={loading}
        loadingMore={loadingMore}
        hasNextPage={hasNextPage}
        onLoadMore={onLoadMore}
        paginationType="loadMore"
        {...rest}
      />
    </div>
  );
}; 