import { useEffect, useRef } from 'react';
import { performanceMonitor } from '../utils/performanceMonitoring';

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface UsePerformanceMetricsOptions {
  componentName: string;
  tags?: Record<string, string>;
}

/**
 * React hook for measuring component performance metrics
 */
export function usePerformanceMetrics({ componentName, tags }: UsePerformanceMetricsOptions) {
  const mountTime = useRef(performance.now());
  const renderCount = useRef(0);

  useEffect(() => {
    // Record mount time
    const mountDuration = performance.now() - mountTime.current;
    performanceMonitor.record(`${componentName}.mount`, mountDuration, 'ms', tags);

    // Setup performance observer for layout effects
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift') {
          performanceMonitor.record(
            `${componentName}.layout-shift`,
            (entry as LayoutShift).value,
            'count',
            tags
          );
        } else if (entry.entryType === 'largest-contentful-paint') {
          performanceMonitor.record(
            `${componentName}.lcp`,
            entry.startTime,
            'ms',
            tags
          );
        }
      }
    });

    observer.observe({ entryTypes: ['layout-shift', 'largest-contentful-paint'] });

    // Cleanup
    return () => {
      observer.disconnect();
      performanceMonitor.record(
        `${componentName}.unmount`,
        performance.now() - mountTime.current,
        'ms',
        tags
      );
    };
  }, [componentName, tags]);

  // Record render count
  renderCount.current += 1;
  performanceMonitor.record(
    `${componentName}.render-count`,
    renderCount.current,
    'count',
    tags
  );

  // Return functions for manual measurements
  return {
    measureInteraction: (name: string, fn: () => void | Promise<void>) => {
      return performanceMonitor.measure(
        `${componentName}.interaction.${name}`,
        fn,
        tags
      );
    },
    recordMetric: (name: string, value: number, unit: 'ms' | 'bytes' | 'count') => {
      performanceMonitor.record(
        `${componentName}.${name}`,
        value,
        unit,
        tags
      );
    }
  };
} 