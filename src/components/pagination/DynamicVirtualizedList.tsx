import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';

export interface DynamicVirtualizedListProps<T> {
  // Data
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey: (item: T) => string;
  // Virtualization options
  overscanCount?: number;
  estimatedItemHeight?: number;
  // Container options
  className?: string;
  containerHeight?: number | string;
  // Loading states
  isLoading?: boolean;
  loadingIndicator?: React.ReactNode;
  // Scroll handling
  onScroll?: (scrollTop: number) => void;
  scrollRestoration?: boolean;
  initialScrollOffset?: number;
  // Performance options
  resizeDebounceMs?: number;
  // Infinite scroll options
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  loadingMore?: boolean;
}

interface ItemMeasurement {
  height: number;
  top: number;
  bottom: number;
}

export function DynamicVirtualizedList<T>({
  items,
  renderItem,
  getItemKey,
  overscanCount = 3,
  estimatedItemHeight = 50,
  className,
  containerHeight = '400px',
  isLoading = false,
  loadingIndicator,
  onScroll,
  scrollRestoration = true,
  initialScrollOffset,
  resizeDebounceMs = 100,
  onLoadMore,
  hasNextPage = false,
  loadingMore = false,
}: DynamicVirtualizedListProps<T>) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null);
  const isScrolling = useRef(false);
  const lastMeasuredIndex = useRef(-1);

  // State
  const [measurements, setMeasurements] = useState<Map<string, ItemMeasurement>>(new Map());
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const [totalHeight, setTotalHeight] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Default loading indicator
  const defaultLoadingIndicator = (
    <div className="flex justify-center p-4">
      <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  );

  // Calculate item positions and total height
  const calculatePositions = useCallback(() => {
    let currentTop = 0;
    let maxIndex = -1;
    const newMeasurements = new Map<string, ItemMeasurement>();

    items.forEach((item, index) => {
      const key = getItemKey(item);
      const element = itemRefs.current.get(key);
      const existingMeasurement = measurements.get(key);

      if (element) {
        const height = element.offsetHeight;
        newMeasurements.set(key, {
          height,
          top: currentTop,
          bottom: currentTop + height,
        });
        currentTop += height;
        maxIndex = index;
      } else if (existingMeasurement) {
        newMeasurements.set(key, {
          ...existingMeasurement,
          top: currentTop,
          bottom: currentTop + existingMeasurement.height,
        });
        currentTop += existingMeasurement.height;
        maxIndex = index;
      } else {
        newMeasurements.set(key, {
          height: estimatedItemHeight,
          top: currentTop,
          bottom: currentTop + estimatedItemHeight,
        });
        currentTop += estimatedItemHeight;
      }
    });

    lastMeasuredIndex.current = maxIndex;
    setMeasurements(newMeasurements);
    setTotalHeight(currentTop);
  }, [items, getItemKey, measurements, estimatedItemHeight]);

  // Calculate visible range based on scroll position
  const calculateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight } = containerRef.current;
    const overscanBefore = Math.max(0, overscanCount);
    const overscanAfter = Math.max(0, overscanCount);

    let startIndex = 0;
    let endIndex = items.length - 1;

    // Binary search for start index
    let low = 0;
    let high = items.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const key = getItemKey(items[mid]);
      const measurement = measurements.get(key);

      if (!measurement) {
        high = mid - 1;
        continue;
      }

      if (measurement.bottom >= scrollTop) {
        endIndex = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    startIndex = Math.max(0, endIndex - overscanBefore);

    // Binary search for end index
    low = startIndex;
    high = items.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const key = getItemKey(items[mid]);
      const measurement = measurements.get(key);

      if (!measurement) {
        low = mid + 1;
        continue;
      }

      if (measurement.top <= scrollTop + clientHeight) {
        startIndex = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    endIndex = Math.min(items.length - 1, startIndex + overscanAfter);

    setVisibleRange({ start: startIndex, end: endIndex });
  }, [items, getItemKey, measurements, overscanCount]);

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

    if (!isScrolling.current) {
      isScrolling.current = true;
      requestAnimationFrame(() => {
        calculateVisibleRange();
        isScrolling.current = false;
      });
    }

    // Save scroll position if restoration is enabled
    if (scrollRestoration) {
      sessionStorage.setItem('virtualizedListScrollTop', scrollTop.toString());
    }

    // Handle infinite scroll
    if (
      onLoadMore &&
      hasNextPage &&
      !loadingMore &&
      scrollHeight - scrollTop <= clientHeight * 1.5
    ) {
      onLoadMore();
    }

    onScroll?.(scrollTop);
  }, [calculateVisibleRange, scrollRestoration, onLoadMore, hasNextPage, loadingMore, onScroll]);

  // Initialize resize observer
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;

    resizeObserver.current = new ResizeObserver(() => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }

      resizeTimeout.current = setTimeout(() => {
        calculatePositions();
        calculateVisibleRange();
      }, resizeDebounceMs);
    });

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
    };
  }, [calculatePositions, calculateVisibleRange, resizeDebounceMs]);

  // Observe item resizes
  useEffect(() => {
    if (!resizeObserver.current) return;

    // Clean up old observations
    resizeObserver.current.disconnect();

    // Observe visible items
    itemRefs.current.forEach((element) => {
      resizeObserver.current?.observe(element);
    });
  }, [visibleRange]);

  // Handle initial scroll position
  useEffect(() => {
    if (isInitialized || !containerRef.current) return;

    let scrollTop = initialScrollOffset;
    if (scrollRestoration && !scrollTop) {
      const saved = sessionStorage.getItem('virtualizedListScrollTop');
      if (saved) {
        scrollTop = parseInt(saved, 10);
      }
    }

    if (scrollTop) {
      containerRef.current.scrollTop = scrollTop;
    }
    setIsInitialized(true);
  }, [isInitialized, initialScrollOffset, scrollRestoration]);

  // Initial measurements and cleanup
  useEffect(() => {
    calculatePositions();
    calculateVisibleRange();

    return () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
    };
  }, [calculatePositions, calculateVisibleRange]);

  // Render visible items
  const renderItems = () => {
    const itemsToRender = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      const item = items[i];
      if (!item) continue;

      const key = getItemKey(item);
      const measurement = measurements.get(key);
      if (!measurement) continue;

      itemsToRender.push(
        <div
          key={key}
          ref={(el) => {
            if (el) {
              itemRefs.current.set(key, el);
            } else {
              itemRefs.current.delete(key);
            }
          }}
          style={{
            position: 'absolute',
            top: measurement.top,
            left: 0,
            right: 0,
          }}
        >
          {renderItem(item, i)}
        </div>
      );
    }
    return itemsToRender;
  };

  // Loading state
  if (isLoading && items.length === 0) {
    return loadingIndicator || defaultLoadingIndicator;
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn('relative overflow-y-auto', className)}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {renderItems()}
      </div>
      {loadingMore && (loadingIndicator || defaultLoadingIndicator)}
    </div>
  );
} 