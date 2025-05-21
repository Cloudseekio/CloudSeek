import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { PaginationBase, PaginationBaseProps } from './PaginationBase';

export interface VirtualizedListProps<T> extends PaginationBaseProps {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
  scrollRestoration?: boolean;
  containerHeight?: number | string;
}

export const VirtualizedList = <T,>({
  items,
  renderItem,
  itemHeight,
  overscan = 3,
  className,
  onScroll,
  scrollRestoration = true,
  containerHeight = '400px',
  loading = false,
  loadingMore = false,
  hasNextPage = false,
  onLoadMore,
  ...rest
}: VirtualizedListProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRestoration) {
      const savedScrollTop = sessionStorage.getItem('virtualizedListScrollTop');
      if (savedScrollTop && containerRef.current) {
        containerRef.current.scrollTop = parseInt(savedScrollTop, 10);
      }
    }
  }, [scrollRestoration]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);

    if (scrollRestoration) {
      sessionStorage.setItem('virtualizedListScrollTop', newScrollTop.toString());
    }

    // Check if we need to load more items
    const scrollHeight = event.currentTarget.scrollHeight;
    const clientHeight = event.currentTarget.clientHeight;
    const scrolledToBottom = scrollHeight - (newScrollTop + clientHeight) < itemHeight * 2;

    if (scrolledToBottom && hasNextPage && !loading && !loadingMore && onLoadMore) {
      onLoadMore();
    }
  };

  const totalHeight = items.length * itemHeight;
  const visibleCount = Math.ceil(containerSize.height / itemHeight) + overscan * 2;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length, startIndex + visibleCount);

  const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
    item,
    index: startIndex + index,
    style: {
      position: 'absolute' as const,
      top: (startIndex + index) * itemHeight,
      left: 0,
      right: 0,
      height: itemHeight,
    },
  }));

  const defaultLoadingIndicator = (
    <div className="flex justify-center p-4">
      <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  );

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ height: containerHeight, position: 'relative', overflowY: 'auto' }}
        className="relative"
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map(({ item, index, style }) => (
            <div key={index} style={style}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {loadingMore && defaultLoadingIndicator}

      <PaginationBase
        loading={loading}
        loadingMore={loadingMore}
        hasNextPage={hasNextPage}
        onLoadMore={onLoadMore}
        paginationType="virtual"
        {...rest}
      />
    </div>
  );
}; 