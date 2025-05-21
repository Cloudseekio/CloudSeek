import { useCallback, useEffect, useRef, useState } from 'react';

interface VirtualizationOptions {
  // Item options
  estimatedItemHeight: number;
  overscanCount: number;
  // Performance options
  measurementDebounceMs?: number;
  scrollDebounceMs?: number;
  // Scroll restoration
  initialScrollOffset?: number;
  preserveScrollPosition?: boolean;
}

interface ItemMeasurement {
  height: number;
  top: number;
  bottom: number;
}

interface VirtualizationState {
  // Visible range
  startIndex: number;
  endIndex: number;
  // Measurements
  measurements: Map<string, ItemMeasurement>;
  totalHeight: number;
  // Scroll position
  scrollTop: number;
  // Loading state
  isScrolling: boolean;
}

export function useVirtualization<T>(
  items: T[],
  getItemKey: (item: T) => string,
  options: VirtualizationOptions
) {
  const {
    estimatedItemHeight,
    overscanCount,
    measurementDebounceMs = 100,
    scrollDebounceMs = 50,
    initialScrollOffset,
    preserveScrollPosition = true,
  } = options;

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const measurementTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const prevItemsLength = useRef<number>(items.length);

  // State
  const [state, setState] = useState<VirtualizationState>({
    startIndex: 0,
    endIndex: 0,
    measurements: new Map(),
    totalHeight: 0,
    scrollTop: initialScrollOffset || 0,
    isScrolling: false,
  });

  // Calculate item positions and total height
  const calculatePositions = useCallback(() => {
    let currentTop = 0;
    const newMeasurements = new Map<string, ItemMeasurement>();

    items.forEach((item) => {
      const key = getItemKey(item);
      const element = itemRefs.current.get(key);
      const existingMeasurement = state.measurements.get(key);

      if (element) {
        const height = element.offsetHeight;
        newMeasurements.set(key, {
          height,
          top: currentTop,
          bottom: currentTop + height,
        });
        currentTop += height;
      } else if (existingMeasurement) {
        newMeasurements.set(key, {
          ...existingMeasurement,
          top: currentTop,
          bottom: currentTop + existingMeasurement.height,
        });
        currentTop += existingMeasurement.height;
      } else {
        newMeasurements.set(key, {
          height: estimatedItemHeight,
          top: currentTop,
          bottom: currentTop + estimatedItemHeight,
        });
        currentTop += estimatedItemHeight;
      }
    });

    setState(prev => ({
      ...prev,
      measurements: newMeasurements,
      totalHeight: currentTop,
    }));
  }, [items, getItemKey, state.measurements, estimatedItemHeight]);

  // Calculate visible range
  const calculateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight } = containerRef.current;
    const overscanBefore = Math.max(0, overscanCount);
    const overscanAfter = Math.max(0, overscanCount);

    // Binary search for start index
    let startIndex = 0;
    let endIndex = items.length - 1;

    let low = 0;
    let high = items.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const key = getItemKey(items[mid]);
      const measurement = state.measurements.get(key);

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
      const measurement = state.measurements.get(key);

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

    setState(prev => ({
      ...prev,
      startIndex,
      endIndex,
      scrollTop,
    }));
  }, [items, getItemKey, state.measurements, overscanCount]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    if (!state.isScrolling) {
      setState(prev => ({ ...prev, isScrolling: true }));
    }

    scrollTimeout.current = setTimeout(() => {
      setState(prev => ({ ...prev, isScrolling: false }));
    }, scrollDebounceMs);

    calculateVisibleRange();
  }, [calculateVisibleRange, scrollDebounceMs, state.isScrolling]);

  // Initialize resize observer
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;

    resizeObserver.current = new ResizeObserver(() => {
      if (measurementTimeout.current) {
        clearTimeout(measurementTimeout.current);
      }

      measurementTimeout.current = setTimeout(() => {
        calculatePositions();
        calculateVisibleRange();
      }, measurementDebounceMs);
    });

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      if (measurementTimeout.current) {
        clearTimeout(measurementTimeout.current);
      }
    };
  }, [calculatePositions, calculateVisibleRange, measurementDebounceMs]);

  // Observe item resizes
  useEffect(() => {
    if (!resizeObserver.current) return;

    // Clean up old observations
    resizeObserver.current.disconnect();

    // Observe visible items
    itemRefs.current.forEach((element) => {
      resizeObserver.current?.observe(element);
    });
  }, [state.startIndex, state.endIndex]);

  // Handle items length change
  useEffect(() => {
    if (items.length !== prevItemsLength.current) {
      if (preserveScrollPosition) {
        // Save current scroll position
        const scrollTop = containerRef.current?.scrollTop || 0;
        calculatePositions();
        // Restore scroll position
        if (containerRef.current) {
          containerRef.current.scrollTop = scrollTop;
        }
      } else {
        calculatePositions();
      }
      prevItemsLength.current = items.length;
    }
  }, [items.length, calculatePositions, preserveScrollPosition]);

  // Initial setup
  useEffect(() => {
    calculatePositions();
    if (initialScrollOffset && containerRef.current) {
      containerRef.current.scrollTop = initialScrollOffset;
    }
    calculateVisibleRange();
  }, [calculatePositions, calculateVisibleRange, initialScrollOffset]);

  return {
    containerRef,
    itemRefs,
    startIndex: state.startIndex,
    endIndex: state.endIndex,
    totalHeight: state.totalHeight,
    isScrolling: state.isScrolling,
    handleScroll,
    measurements: state.measurements,
  };
} 