import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { PaginationBase, PaginationBaseProps } from './PaginationBase';

export interface InfiniteScrollProps extends PaginationBaseProps {
  threshold?: number;
  scrollContainer?: HTMLElement | null;
  loadingIndicator?: React.ReactNode;
  children: React.ReactNode;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  threshold = 0.8,
  scrollContainer = null,
  loadingIndicator,
  children,
  onLoadMore,
  loading = false,
  loadingMore = false,
  hasNextPage = false,
  className,
  ...rest
}) => {
  const loadingRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const currentLoadingRef = loadingRef.current;
    if (!currentLoadingRef || !hasNextPage || loading || loadingMore) return;

    const handleObserver: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !loading && !loadingMore && onLoadMore) {
        onLoadMore();
      }
    };

    observer.current = new IntersectionObserver(handleObserver, {
      root: scrollContainer,
      rootMargin: '0px',
      threshold,
    });

    observer.current.observe(currentLoadingRef);

    return () => {
      if (observer.current && currentLoadingRef) {
        observer.current.unobserve(currentLoadingRef);
      }
    };
  }, [hasNextPage, loading, loadingMore, onLoadMore, scrollContainer, threshold]);

  const defaultLoadingIndicator = (
    <div className="flex justify-center p-4">
      <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  );

  return (
    <div className={cn('relative', className)}>
      {children}
      <div ref={loadingRef}>
        {loadingMore && (loadingIndicator || defaultLoadingIndicator)}
      </div>
      <PaginationBase
        loading={loading}
        loadingMore={loadingMore}
        hasNextPage={hasNextPage}
        onLoadMore={onLoadMore}
        paginationType="infinite"
        {...rest}
      />
    </div>
  );
}; 