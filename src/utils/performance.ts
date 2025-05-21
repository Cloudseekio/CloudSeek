import logger from './logger';

interface PerformanceMetric {
  component: string;
  action: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 100;

  measureStart(component: string, action: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.addMetric({
        component,
        action,
        duration,
        timestamp: Date.now()
      });

      if (duration > 100) {
        logger.warn(`Slow performance detected in ${component}: ${action} took ${duration.toFixed(2)}ms`);
      }
    };
  }

  private addMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Keep only the last MAX_METRICS entries
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getAverageMetrics(): Record<string, number> {
    const sums: Record<string, { total: number; count: number }> = {};
    
    this.metrics.forEach(metric => {
      const key = `${metric.component}:${metric.action}`;
      if (!sums[key]) {
        sums[key] = { total: 0, count: 0 };
      }
      sums[key].total += metric.duration;
      sums[key].count += 1;
    });

    return Object.entries(sums).reduce((acc, [key, { total, count }]) => {
      acc[key] = total / count;
      return acc;
    }, {} as Record<string, number>);
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

export function usePerformanceMonitoring(component: string) {
  return {
    measureAction: (action: string) => performanceMonitor.measureStart(component, action)
  };
} 