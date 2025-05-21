import logger from './logger';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  timestamp: number;
  tags?: Record<string, string>;
}

export interface PerformanceOptions {
  sampleRate?: number;
  reportingEndpoint?: string;
  bufferSize?: number;
  flushInterval?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private options: Required<PerformanceOptions>;
  private flushTimeout: NodeJS.Timeout | null = null;

  constructor(options: PerformanceOptions = {}) {
    this.options = {
      sampleRate: options.sampleRate ?? 1.0,
      reportingEndpoint: options.reportingEndpoint ?? '/api/metrics',
      bufferSize: options.bufferSize ?? 100,
      flushInterval: options.flushInterval ?? 30000
    };

    this.startPeriodicFlush();
  }

  /**
   * Records a performance metric
   */
  record(
    name: string,
    value: number,
    unit: PerformanceMetric['unit'],
    tags?: Record<string, string>
  ): void {
    // Apply sampling
    if (Math.random() > this.options.sampleRate) {
      return;
    }

    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags
    };

    this.metrics.push(metric);
    logger.debug('Performance metric recorded', {
      metric: JSON.stringify(metric)
    });

    if (this.metrics.length >= this.options.bufferSize) {
      this.flush().catch(error => {
        logger.error('Failed to flush metrics', {
          error: error instanceof Error ? error.message : String(error)
        });
      });
    }
  }

  /**
   * Measures the execution time of an async function
   */
  async measure<T>(name: string, fn: () => Promise<T> | T, tags?: Record<string, string>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.record(name, duration, 'ms', tags);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.record(`${name}.error`, duration, 'ms', {
        ...tags,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Creates a measured version of a function
   */
  createMeasuredFunction<Args extends unknown[], Return>(
    name: string,
    fn: (...args: Args) => Return | Promise<Return>,
    tags?: Record<string, string>
  ): (...args: Args) => Promise<Return> {
    return async (...args: Args) => {
      return this.measure(name, () => fn(...args), tags);
    };
  }

  /**
   * Records resource timing metrics
   */
  recordResourceTiming(resource: PerformanceResourceTiming, tags?: Record<string, string>): void {
    // DNS lookup time
    if (resource.domainLookupEnd > 0) {
      this.record(
        'resource.dns',
        resource.domainLookupEnd - resource.domainLookupStart,
        'ms',
        { ...tags, url: resource.name }
      );
    }

    // Connection time
    if (resource.connectEnd > 0) {
      this.record(
        'resource.connect',
        resource.connectEnd - resource.connectStart,
        'ms',
        { ...tags, url: resource.name }
      );
    }

    // Time to first byte
    if (resource.responseStart > 0) {
      this.record(
        'resource.ttfb',
        resource.responseStart - resource.requestStart,
        'ms',
        { ...tags, url: resource.name }
      );
    }

    // Download time
    if (resource.responseEnd > 0) {
      this.record(
        'resource.download',
        resource.responseEnd - resource.responseStart,
        'ms',
        { ...tags, url: resource.name }
      );
    }

    // Total time
    this.record(
      'resource.total',
      resource.duration,
      'ms',
      { ...tags, url: resource.name }
    );

    // Transfer size
    if (resource.transferSize > 0) {
      this.record(
        'resource.size',
        resource.transferSize,
        'bytes',
        { ...tags, url: resource.name }
      );
    }
  }

  /**
   * Flushes metrics to the reporting endpoint
   */
  private async flush(): Promise<void> {
    if (this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = [];

    try {
      const response = await fetch(this.options.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metricsToSend)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      logger.debug('Metrics flushed successfully', {
        metricCount: String(metricsToSend.length)
      });
    } catch (error) {
      logger.error('Failed to flush metrics', {
        error: error instanceof Error ? error.message : String(error)
      });
      // Put the metrics back in the buffer
      this.metrics.unshift(...metricsToSend);
    }
  }

  /**
   * Starts periodic flushing of metrics
   */
  private startPeriodicFlush(): void {
    this.flushTimeout = setInterval(() => {
      this.flush().catch(error => {
        logger.error('Failed to flush metrics', {
          error: error instanceof Error ? error.message : String(error)
        });
      });
    }, this.options.flushInterval);
  }

  /**
   * Stops the monitor and flushes remaining metrics
   */
  stop(): void {
    if (this.flushTimeout) {
      clearInterval(this.flushTimeout);
      this.flushTimeout = null;
    }

    this.flush().catch(error => {
      logger.error('Failed to flush metrics during stop', {
        error: error instanceof Error ? error.message : String(error)
      });
    });
  }
}

// Create a singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export the class for testing or custom instances
export { PerformanceMonitor }; 