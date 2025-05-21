import { useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, Location as RouterLocation } from 'react-router-dom';

interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
}

interface ScrollRestorationOptions {
  // Maximum age of scroll positions to keep (in milliseconds)
  maxAge?: number;
  // Whether to handle hash links (#section-1)
  handleHashLinks?: boolean;
  // Smooth scroll behavior
  smoothScroll?: boolean;
  // Offset from the top when scrolling to elements (in pixels)
  scrollOffset?: number;
  // Custom scroll element (defaults to window)
  scrollElement?: HTMLElement | null;
  // Whether to persist scroll positions across sessions
  persistAcrossSessions?: boolean;
  // Custom key for the route (defaults to pathname)
  getKey?: (location: RouterLocation) => string;
}

// Store scroll positions in memory
const scrollPositions = new Map<string, ScrollPosition>();

// Default options
const defaultOptions: Required<ScrollRestorationOptions> = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  handleHashLinks: true,
  smoothScroll: true,
  scrollOffset: 0,
  scrollElement: null,
  persistAcrossSessions: true,
  getKey: (location: RouterLocation) => location.pathname,
};

// Initialize scroll element
if (typeof window !== 'undefined') {
  defaultOptions.scrollElement = window.document.documentElement;
}

/**
 * Save scroll position to storage if persistence is enabled
 */
const saveScrollPositions = () => {
  if (typeof window === 'undefined') return;

  const positions = Array.from(scrollPositions.entries())
    .filter(([, pos]) => Date.now() - pos.timestamp < defaultOptions.maxAge);

  localStorage.setItem('scrollPositions', JSON.stringify(positions));
};

/**
 * Load scroll positions from storage if available
 */
const loadScrollPositions = () => {
  if (typeof window === 'undefined') return;

  try {
    const saved = localStorage.getItem('scrollPositions');
    if (!saved) return;

    const positions = JSON.parse(saved) as [string, ScrollPosition][];
    positions
      .filter(([, pos]) => Date.now() - pos.timestamp < defaultOptions.maxAge)
      .forEach(([key, pos]) => scrollPositions.set(key, pos));
  } catch (error) {
    console.error('Error loading scroll positions:', error);
  }
};

/**
 * Scroll to a specific element with offset
 */
const scrollToElement = (
  element: HTMLElement,
  offset: number = 0,
  smooth: boolean = true
): void => {
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({
    top,
    behavior: smooth ? 'smooth' : 'auto',
  });
};

/**
 * Hook for implementing enhanced scroll restoration
 */
export const useScrollRestoration = (options: ScrollRestorationOptions = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Merge options with defaults
  const {
    maxAge,
    handleHashLinks,
    smoothScroll,
    scrollOffset,
    scrollElement,
    persistAcrossSessions,
    getKey,
  } = { ...defaultOptions, ...options };

  // Load saved scroll positions on mount
  useEffect(() => {
    if (persistAcrossSessions) {
      loadScrollPositions();
    }
  }, [persistAcrossSessions]);

  // Save scroll positions before unload
  useEffect(() => {
    if (!persistAcrossSessions) return;

    const handleBeforeUnload = () => {
      saveScrollPositions();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [persistAcrossSessions]);

  // Handle scroll position saving
  const saveScrollPosition = useCallback(() => {
    const key = getKey(location);
    const scrollPos: ScrollPosition = {
      x: window.pageXOffset,
      y: window.pageYOffset,
      timestamp: Date.now(),
    };
    scrollPositions.set(key, scrollPos);

    // Clean up old positions
    Array.from(scrollPositions.entries())
      .filter(([, pos]) => Date.now() - pos.timestamp > maxAge)
      .forEach(([key]) => scrollPositions.delete(key));
  }, [location, maxAge, getKey]);

  // Handle scroll restoration
  useEffect(() => {
    const key = getKey(location);
    const hash = location.hash;

    // Handle hash links
    if (handleHashLinks && hash) {
      const element = document.querySelector(hash);
      if (element) {
        scrollToElement(element as HTMLElement, scrollOffset, smoothScroll);
        return;
      }
    }

    // Restore scroll position
    const savedPosition = scrollPositions.get(key);
    if (savedPosition) {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Delay scroll restoration to ensure content is rendered
      scrollTimeout.current = setTimeout(() => {
        window.scrollTo({
          left: savedPosition.x,
          top: savedPosition.y,
          behavior: smoothScroll ? 'smooth' : 'auto',
        });
      }, 100);
    }

    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [location, handleHashLinks, smoothScroll, scrollOffset, getKey]);

  // Save scroll position on scroll
  useEffect(() => {
    if (!scrollElement) return;

    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Debounce scroll position saving
      scrollTimeout.current = setTimeout(() => {
        saveScrollPosition();
      }, 100);
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [scrollElement, saveScrollPosition]);

  // Utility functions
  const scrollToTop = useCallback((smooth: boolean = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  const scrollToHash = useCallback((hash: string, smooth: boolean = true) => {
    const element = document.querySelector(hash);
    if (element) {
      scrollToElement(element as HTMLElement, scrollOffset, smooth);
    }
  }, [scrollOffset]);

  const updateUrlHash = useCallback((hash: string) => {
    navigate({ hash }, { replace: true });
  }, [navigate]);

  return {
    scrollToTop,
    scrollToHash,
    updateUrlHash,
    saveScrollPosition,
  };
}; 