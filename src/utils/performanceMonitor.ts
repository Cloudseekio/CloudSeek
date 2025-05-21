import { useEffect, useRef, useCallback } from 'react';

// Types for core web vitals
interface WebVitals {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

// Types for component performance
interface ComponentMetric {
  name: string;
  renderTime: number;
  updateCount: number;
  lastUpdate: number;
}

// Types for resource timing
interface ResourceMetric {
  name: string;
  type: string;
  startTime: number;
  duration: number;
  transferSize: number;
  decodedBodySize: number;
}

// Types for user interactions
interface InteractionMetric {
  type: string;
  target: string;
  startTime: number;
  duration: number;
  inputDelay: number;
}

// Types for error tracking
interface ErrorMetric {
  timestamp: number;
  message: string;
  error: string;
  stack: string;
}

// Add MemoryInfo interface
interface MemoryInfo {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

// Combined performance metrics
interface PerformanceMetrics {
  // Core web vitals
  webVitals: WebVitals;
  
  // Component metrics
  components: Map<string, ComponentMetric>;
  
  // Resource metrics
  resources: ResourceMetric[];
  
  // Interaction metrics
  interactions: InteractionMetric[];
  
  // Error metrics
  errors: ErrorMetric[];
  
  // Memory metrics
  memory: {
    jsHeapSize: number;
    totalHeapSize: number;
    heapLimit: number;
  };
}

interface PerformanceMonitorOptions {
  // Sampling rate for metrics (0-1)
  sampleRate?: number;
  
  // Maximum events to store
  maxEvents?: number;
  
  // Debug mode
  debug?: boolean;
  
  // Callbacks
  onMetricUpdate?: (metrics: Partial<PerformanceMetrics>) => void;
  onError?: (error: ErrorMetric) => void;
  onVitalsUpdate?: (vitals: WebVitals) => void;
}

// Add type definitions for Performance API entries
interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
  target: EventTarget;
}

class PerformanceMonitor {
  private options: Required<PerformanceMonitorOptions>;
  private metrics: PerformanceMetrics;
  private observer: PerformanceObserver | null = null;
  private interactionObserver: PerformanceObserver | null = null;
  private disposed = false;

  constructor(options: PerformanceMonitorOptions = {}) {
    this.options = {
      sampleRate: 1,
      maxEvents: 1000,
      debug: false,
      onMetricUpdate: () => {},
      onError: () => {},
      onVitalsUpdate: () => {},
      ...options,
    };

    this.metrics = {
      webVitals: {
        fcp: 0,
        lcp: 0,
        fid: 0,
        cls: 0,
        ttfb: 0,
      },
      components: new Map(),
      resources: [],
      interactions: [],
      errors: [],
      memory: {
        jsHeapSize: 0,
        totalHeapSize: 0,
        heapLimit: 0,
      },
    };

    this.initializeObservers();
  }

  private initializeObservers(): void {
    // Observe paint timing
    this.observePaintTiming();
    
    // Observe layout shifts
    this.observeLayoutShifts();
    
    // Observe long tasks
    this.observeLongTasks();
    
    // Observe resource timing
    this.observeResourceTiming();
    
    // Observe user interactions
    this.observeUserInteractions();
  }

  private observePaintTiming(): void {
    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.webVitals.fcp = entry.startTime;
          } else if (entry.name === 'largest-contentful-paint') {
            this.metrics.webVitals.lcp = entry.startTime;
          }
        }

        this.options.onVitalsUpdate(this.metrics.webVitals);
      });

      this.observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    } catch (error) {
      this.logError('Failed to observe paint timing', error as Error);
    }
  }

  private observeLayoutShifts(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        let clsValue = 0;
        
        for (const entry of list.getEntries()) {
          const layoutShift = entry as LayoutShiftEntry;
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
          }
        }

        this.metrics.webVitals.cls = clsValue;
        this.options.onVitalsUpdate(this.metrics.webVitals);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      this.logError('Failed to observe layout shifts', error as Error);
    }
  }

  private observeLongTasks(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        for (const entry of entries) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            this.metrics.interactions.push({
              type: 'long-task',
              target: entry.name,
              startTime: entry.startTime,
              duration: entry.duration,
              inputDelay: 0,
            });
          }
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      this.logError('Failed to observe long tasks', error as Error);
    }
  }

  private observeResourceTiming(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        for (const entry of entries) {
          const resource = entry as PerformanceResourceTiming;
          
          this.metrics.resources.push({
            name: resource.name,
            type: resource.initiatorType,
            startTime: resource.startTime,
            duration: resource.duration,
            transferSize: resource.transferSize,
            decodedBodySize: resource.decodedBodySize,
          });

          // Keep only the last maxEvents resources
          if (this.metrics.resources.length > this.options.maxEvents) {
            this.metrics.resources.shift();
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      this.logError('Failed to observe resource timing', error as Error);
    }
  }

  private observeUserInteractions(): void {
    try {
      this.interactionObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        for (const entry of entries) {
          const interaction = entry as FirstInputEntry;
          this.metrics.interactions.push({
            type: entry.name,
            target: interaction.target?.toString() || 'unknown',
            startTime: entry.startTime,
            duration: entry.duration,
            inputDelay: interaction.processingStart - entry.startTime,
          });

          // Keep only the last maxEvents interactions
          if (this.metrics.interactions.length > this.options.maxEvents) {
            this.metrics.interactions.shift();
          }
        }
      });

      this.interactionObserver.observe({ entryTypes: ['first-input', 'event'] });
    } catch (error) {
      this.logError('Failed to observe user interactions', error as Error);
    }
  }

  // Track component render time
  trackComponent(name: string, renderTime: number): void {
    const existing = this.metrics.components.get(name);
    
    this.metrics.components.set(name, {
      name,
      renderTime: existing ? (existing.renderTime + renderTime) / 2 : renderTime,
      updateCount: existing ? existing.updateCount + 1 : 1,
      lastUpdate: performance.now(),
    });

    this.options.onMetricUpdate({ components: this.metrics.components });
  }

  // Track errors
  trackError(error: Error, componentName?: string): void {
    const errorMetric: ErrorMetric = {
      timestamp: Date.now(),
      message: error.message,
      error: error.toString(),
      stack: error.stack || 'No stack trace available',
    };

    this.metrics.errors.push(errorMetric);
    
    // Keep only the last maxEvents errors
    if (this.metrics.errors.length > this.options.maxEvents) {
      this.metrics.errors.shift();
    }

    this.options.onError(errorMetric);
  }

  // Get current metrics
  getMetrics(): PerformanceMetrics {
    // Update memory metrics if available
    const memory = (performance as unknown as { memory?: MemoryInfo }).memory;
    if (memory) {
      this.metrics.memory = {
        jsHeapSize: memory.usedJSHeapSize,
        totalHeapSize: memory.totalJSHeapSize,
        heapLimit: memory.jsHeapSizeLimit,
      };
    }

    return { ...this.metrics };
  }

  // Log errors with context
  private logError(message: string, error: Error): void {
    const errorMetric: ErrorMetric = {
      timestamp: Date.now(),
      message,
      error: error.toString(),
      stack: error.stack || 'No stack trace available'
    };

    this.metrics.errors.push(errorMetric);

    // Keep only the last maxEvents errors
    if (this.metrics.errors.length > this.options.maxEvents) {
      this.metrics.errors.shift();
    }

    if (this.options.onError) {
      this.options.onError(errorMetric);
    }
  }

  // Cleanup
  dispose(): void {
    if (this.disposed) return;

    this.observer?.disconnect();
    this.interactionObserver?.disconnect();
    this.disposed = true;
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor(options: PerformanceMonitorOptions = {}) {
  const monitorRef = useRef<PerformanceMonitor>();

  if (!monitorRef.current) {
    monitorRef.current = new PerformanceMonitor(options);
  }

  useEffect(() => {
    const monitor = monitorRef.current!;
    return () => {
      monitor.dispose();
    };
  }, []);

  // Track component render time
  const trackRender = useCallback((name: string) => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      monitorRef.current?.trackComponent(name, renderTime);
    };
  }, []);

  return {
    monitor: monitorRef.current,
    trackRender,
  };
}

// Create a singleton instance for global usage
export const performanceMonitor = new PerformanceMonitor({
  debug: process.env.NODE_ENV === 'development',
}); 