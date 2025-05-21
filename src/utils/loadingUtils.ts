import { useEffect, useState } from 'react';

/**
 * Delay showing loading state to prevent flashing
 */
export function useDelayedLoading(isLoading: boolean, delay = 200): boolean {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isLoading, delay]);

  return showLoading;
}

/**
 * Track loading progress for progress indicators
 */
export function useLoadingProgress(isLoading: boolean, duration = 3000): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 95);
      setProgress(newProgress);
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading, duration]);

  return progress;
}

/**
 * Manage fade transitions for loading states
 */
export function useFadeTransition(isVisible: boolean, duration = 200): {
  opacity: number;
  isShowing: boolean;
} {
  const [opacity, setOpacity] = useState(0);
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isVisible && !isShowing) {
      setIsShowing(true);
      timeoutId = setTimeout(() => setOpacity(1), 10);
    } else if (!isVisible && isShowing) {
      setOpacity(0);
      timeoutId = setTimeout(() => setIsShowing(false), duration);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVisible, duration, isShowing]);

  return { opacity, isShowing };
}

/**
 * Calculate loading message based on duration
 */
export function getLoadingMessage(duration: number): string {
  if (duration < 5000) {
    return 'Loading...';
  } else if (duration < 10000) {
    return 'Still loading...';
  } else if (duration < 20000) {
    return 'This is taking longer than expected...';
  }
  return 'Please wait while we complete this operation...';
}

/**
 * Format loading progress for display
 */
export function formatLoadingProgress(progress: number): string {
  return `${Math.round(progress)}%`;
} 