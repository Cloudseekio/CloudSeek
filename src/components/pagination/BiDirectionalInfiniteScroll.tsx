import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';

export interface BiDirectionalInfiniteScrollProps {
  // Content loading callbacks
  onLoadMore: () => Promise<void>;
  onLoadPrevious: () => Promise<void>;
  // Loading states
  isLoadingMore: boolean;
  isLoadingPrevious: boolean;
  // Availability flags
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  // Optional props
  threshold?: number;
  loadingIndicator?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  // Scroll container (defaults to window)
  scrollContainer?: HTMLElement | null;
  // Initial scroll position
  initialScrollPosition?: number;
  // Preserve scroll position when loading previous items
  preserveScrollPosition?: boolean;
  // Minimum distance from top/bottom to trigger load (in pixels)
  minDistance?: number;
  // Disable scroll restoration while loading
  disableScrollWhileLoading?: boolean;
}

export const BiDirectionalInfiniteScroll: React.FC<BiDirectionalInfiniteScrollProps> = ({
  onLoadMore,
  onLoadPrevious,
  isLoadingMore,
  isLoadingPrevious,
  hasNextPage,
  hasPreviousPage,
  threshold = 0.8,
  loadingIndicator,
  className,
  children,
  scrollContainer = null,
  initialScrollPosition,
  preserveScrollPosition = true,
  minDistance = 100,
  disableScrollWhileLoading = true,
}) => {
  // Refs for scroll handling
  const contentRef = useRef<HTMLDivElement>(null);
  const topTriggerRef = useRef<HTMLDivElement>(null);
  const bottomTriggerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef<number>(0);
  const isRestoringScroll = useRef<boolean>(false);

  // State for scroll position management
  const [isInitialized, setIsInitialized] = useState(false);

  // Default loading indicator
  const defaultLoadingIndicator = (
    <div className="flex justify-center p-4">
      <div className="w-6 h-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  );

  // Handle scroll position restoration after loading previous items
  const restoreScrollPosition = useCallback(() => {
    if (!contentRef.current || !preserveScrollPosition) return;

    const newScrollHeight = contentRef.current.scrollHeight;
    const heightDiff = newScrollHeight - prevScrollHeight.current;

    if (heightDiff > 0 && scrollContainer) {
      isRestoringScroll.current = true;
      scrollContainer.scrollTop += heightDiff;
      isRestoringScroll.current = false;
    }
  }, [preserveScrollPosition, scrollContainer]);

  // Set up intersection observers
  useEffect(() => {
    const topTrigger = topTriggerRef.current;
    const bottomTrigger = bottomTriggerRef.current;
    if (!topTrigger || !bottomTrigger) return;

    const handleIntersection: IntersectionObserverCallback = async (entries) => {
      if (isRestoringScroll.current) return;

      for (const entry of entries) {
        // Loading previous items (top intersection)
        if (entry.target === topTrigger && entry.isIntersecting && hasPreviousPage && !isLoadingPrevious) {
          prevScrollHeight.current = contentRef.current?.scrollHeight || 0;
          await onLoadPrevious();
          restoreScrollPosition();
        }
        // Loading more items (bottom intersection)
        if (entry.target === bottomTrigger && entry.isIntersecting && hasNextPage && !isLoadingMore) {
          await onLoadMore();
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: scrollContainer,
      rootMargin: `${minDistance}px`,
      threshold,
    });

    observer.observe(topTrigger);
    observer.observe(bottomTrigger);

    return () => {
      observer.disconnect();
    };
  }, [
    hasNextPage,
    hasPreviousPage,
    isLoadingMore,
    isLoadingPrevious,
    minDistance,
    onLoadMore,
    onLoadPrevious,
    restoreScrollPosition,
    scrollContainer,
    threshold,
  ]);

  // Handle initial scroll position
  useEffect(() => {
    if (isInitialized || !initialScrollPosition || !contentRef.current) return;

    contentRef.current.scrollTop = initialScrollPosition;
    setIsInitialized(true);
  }, [initialScrollPosition, isInitialized]);

  // Disable scroll while loading if specified
  useEffect(() => {
    if (!disableScrollWhileLoading || !scrollContainer) return;

    let lastScrollTop = scrollContainer.scrollTop;

    const handleScroll = (e: Event) => {
      if (isLoadingMore || isLoadingPrevious) {
        e.preventDefault();
        scrollContainer.scrollTop = lastScrollTop;
      } else {
        lastScrollTop = scrollContainer.scrollTop;
      }
    };

    if (isLoadingMore || isLoadingPrevious) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: false });
    }

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [disableScrollWhileLoading, isLoadingMore, isLoadingPrevious, scrollContainer]);

  return (
    <div
      ref={contentRef}
      className={cn('relative min-h-[200px]', className)}
      style={{ overflowY: 'auto' }}
    >
      {/* Top loading trigger */}
      <div ref={topTriggerRef} className="absolute top-0 left-0 w-full h-px top-trigger">
        {isLoadingPrevious && (loadingIndicator || defaultLoadingIndicator)}
      </div>

      {/* Content */}
      {children}

      {/* Bottom loading trigger */}
      <div ref={bottomTriggerRef} className="absolute bottom-0 left-0 w-full h-px bottom-trigger">
        {isLoadingMore && (loadingIndicator || defaultLoadingIndicator)}
      </div>
    </div>
  );
}; 