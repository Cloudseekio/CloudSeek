import { performanceMonitor } from './performanceMonitoring';
import { webVitalsMonitor, type Metric, type MetricStatus } from './webVitalsMonitoring';
import logger from './logger';

interface AlertThreshold {
  /**
   * Threshold value for the metric
   */
  value: number;

  /**
   * Type of comparison: 'above' or 'below'
   */
  type: 'above' | 'below';
  
  /**
   * Severity of the alert
   */
  severity: 'info' | 'warning' | 'error';
  
  /**
   * Name of the metric to check
   */
  metricName: string;
  
  /**
   * Alert title
   */
  title: string;
  
  /**
   * Alert message
   */
  message: string;
}

interface PerformanceAlert {
  /**
   * Timestamp when the alert was triggered
   */
  timestamp: number;
  
  /**
   * Severity of the alert
   */
  severity: 'info' | 'warning' | 'error';
  
  /**
   * Short title of the alert
   */
  title: string;
  
  /**
   * Detailed message about the alert
   */
  message: string;
  
  /**
   * Metric data that triggered the alert
   */
  metric?: {
    name: string;
    value: number;
    threshold: number;
    status?: MetricStatus;
    page?: string;
  };
}

interface AlertHandlerOptions {
  /**
   * List of thresholds to check
   */
  thresholds?: AlertThreshold[];
  
  /**
   * How often to run the check (in ms)
   */
  checkInterval?: number;
  
  /**
   * Maximum number of alerts to store
   */
  maxAlerts?: number;
  
  /**
   * Whether to log alerts to the console
   */
  logToConsole?: boolean;
  
  /**
   * Function to call when an alert is triggered
   */
  onAlert?: (alert: PerformanceAlert) => void;
}

/**
 * Default thresholds for core web vitals and other metrics
 */
const DEFAULT_THRESHOLDS: AlertThreshold[] = [
  // Core Web Vitals
  {
    metricName: 'LCP',
    value: 4000,
    type: 'above',
    severity: 'error',
    title: 'Slow Largest Contentful Paint',
    message: 'LCP exceeds 4s, indicating slow render time for the largest content element.'
  },
  {
    metricName: 'FID',
    value: 300,
    type: 'above',
    severity: 'error',
    title: 'High First Input Delay',
    message: 'FID exceeds 300ms, indicating poor responsiveness to user interactions.'
  },
  {
    metricName: 'CLS',
    value: 0.25,
    type: 'above',
    severity: 'error',
    title: 'High Cumulative Layout Shift',
    message: 'CLS exceeds 0.25, indicating significant layout instability.'
  },
  {
    metricName: 'INP',
    value: 500,
    type: 'above',
    severity: 'error',
    title: 'Poor Interaction to Next Paint',
    message: 'INP exceeds 500ms, indicating poor interaction responsiveness.'
  },
  
  // Other performance metrics
  {
    metricName: 'script_execution',
    value: 200,
    type: 'above',
    severity: 'warning',
    title: 'Long Script Execution',
    message: 'Script execution time exceeds 200ms, which may block the main thread.'
  },
  {
    metricName: 'resource_load',
    value: 1000,
    type: 'above',
    severity: 'warning',
    title: 'Slow Resource Loading',
    message: 'Resource loading time exceeds 1s, which may impact page load performance.'
  },
  {
    metricName: 'memory_usage',
    value: 80, // 80% of available memory
    type: 'above',
    severity: 'warning',
    title: 'High Memory Usage',
    message: 'Memory usage exceeds 80% of available memory, which may lead to performance issues or crashes.'
  }
];

class PerformanceAlertHandler {
  private options: Required<AlertHandlerOptions>;
  private alerts: PerformanceAlert[] = [];
  private checkIntervalId: number | null = null;
  private lastCheckedTimestamp = 0;
  
  constructor(options: AlertHandlerOptions = {}) {
    this.options = {
      thresholds: DEFAULT_THRESHOLDS,
      checkInterval: 60 * 1000, // Check every minute by default
      maxAlerts: 100,
      logToConsole: true,
      onAlert: undefined,
      ...options
    };
  }
  
  /**
   * Start monitoring for performance issues
   */
  public start(): void {
    this.lastCheckedTimestamp = Date.now();
    
    // Clear any existing intervals
    if (this.checkIntervalId !== null) {
      window.clearInterval(this.checkIntervalId);
    }
    
    // Set up interval to check metrics
    this.checkIntervalId = window.setInterval(() => {
      this.checkMetrics();
    }, this.options.checkInterval) as unknown as number;
    
    // Initial check
    this.checkMetrics();
    
    logger.debug('Performance alert monitoring started');
  }
  
  /**
   * Stop monitoring for performance issues
   */
  public stop(): void {
    if (this.checkIntervalId !== null) {
      window.clearInterval(this.checkIntervalId);
      this.checkIntervalId = null;
    }
    
    logger.debug('Performance alert monitoring stopped');
  }
  
  /**
   * Check metrics against thresholds
   */
  private checkMetrics(): void {
    try {
      // Get web vitals metrics
      const webVitalsMetrics = webVitalsMonitor.getFormattedMetrics();
      
      // Get general performance metrics
      const generalMetrics = performanceMonitor.getMetrics();
      
      // Check all thresholds
      this.options.thresholds.forEach(threshold => {
        // Check if metric should be checked
        let metricValue: number | undefined;
        let status: MetricStatus | undefined;
        let page: string | undefined;
        
        // Check web vitals metrics first
        if (webVitalsMetrics[threshold.metricName]) {
          const metric = webVitalsMetrics[threshold.metricName];
          metricValue = metric.value;
          status = metric.status as MetricStatus;
          page = metric.page;
        }
        // Then check general performance metrics
        else {
          const metrics = generalMetrics;
          if (threshold.metricName === 'memory_usage' && metrics.memory) {
            // Calculate memory usage percentage
            metricValue = (metrics.memory.jsHeapSize / metrics.memory.heapLimit) * 100;
          } else if (threshold.metricName.includes('resource_load')) {
            // Find slowest resource
            const resourceMetrics = metrics.resources || [];
            const slowestResource = resourceMetrics
              .filter(r => r.name.includes('resource_load'))
              .sort((a, b) => b.value - a.value)[0];
            
            if (slowestResource) {
              metricValue = slowestResource.value;
              page = window.location.pathname;
            }
          } else if (threshold.metricName.includes('script_execution')) {
            // Find longest script execution
            const interactionMetrics = metrics.interactions || [];
            const longestScript = interactionMetrics
              .filter(i => i.name.includes('script_execution'))
              .sort((a, b) => b.value - a.value)[0];
            
            if (longestScript) {
              metricValue = longestScript.value;
              page = window.location.pathname;
            }
          }
        }
        
        // Skip if metric not found
        if (metricValue === undefined) {
          return;
        }
        
        // Check threshold
        const isViolated = threshold.type === 'above' 
          ? metricValue > threshold.value
          : metricValue < threshold.value;
        
        if (isViolated) {
          this.triggerAlert({
            timestamp: Date.now(),
            severity: threshold.severity,
            title: threshold.title,
            message: threshold.message,
            metric: {
              name: threshold.metricName,
              value: metricValue,
              threshold: threshold.value,
              status,
              page
            }
          });
        }
      });
      
      this.lastCheckedTimestamp = Date.now();
    } catch (error) {
      logger.error('Error checking performance metrics:', error);
    }
  }
  
  /**
   * Trigger an alert
   */
  private triggerAlert(alert: PerformanceAlert): void {
    // Add to alerts list
    this.alerts.push(alert);
    
    // Trim to max alerts
    if (this.alerts.length > this.options.maxAlerts) {
      this.alerts = this.alerts.slice(-this.options.maxAlerts);
    }
    
    // Log to console if enabled
    if (this.options.logToConsole) {
      const styles = {
        info: 'color: blue; font-weight: bold',
        warning: 'color: orange; font-weight: bold',
        error: 'color: red; font-weight: bold'
      };
      
      console.group(`%c[Performance Alert] ${alert.title}`, styles[alert.severity]);
      console.log('Message:', alert.message);
      if (alert.metric) {
        console.log('Metric:', alert.metric.name);
        console.log('Value:', alert.metric.value);
        console.log('Threshold:', alert.metric.threshold);
        if (alert.metric.status) {
          console.log('Status:', alert.metric.status);
        }
        if (alert.metric.page) {
          console.log('Page:', alert.metric.page);
        }
      }
      console.log('Timestamp:', new Date(alert.timestamp).toLocaleString());
      console.groupEnd();
    }
    
    // Call onAlert callback if provided
    this.options.onAlert?.(alert);
  }
  
  /**
   * Add a custom threshold
   */
  public addThreshold(threshold: AlertThreshold): void {
    this.options.thresholds.push(threshold);
  }
  
  /**
   * Remove a threshold
   */
  public removeThreshold(metricName: string, value: number): void {
    this.options.thresholds = this.options.thresholds.filter(
      t => t.metricName !== metricName || t.value !== value
    );
  }
  
  /**
   * Get all alerts
   */
  public getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }
  
  /**
   * Get the most recent alerts
   */
  public getRecentAlerts(count = 10): PerformanceAlert[] {
    return this.alerts.slice(-count);
  }
  
  /**
   * Clear all alerts
   */
  public clearAlerts(): void {
    this.alerts = [];
  }
}

// Create a singleton instance
export const performanceAlerts = new PerformanceAlertHandler();

// Export the class for testing and custom instances
export { PerformanceAlertHandler };
export type { AlertThreshold, PerformanceAlert, AlertHandlerOptions }; 