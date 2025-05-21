import { webVitalsMonitor, type Metric } from './webVitalsMonitoring';
import analytics from './analytics';
import logger from './logger';
import { getSimplifiedContextInfo } from './deviceInfo';

interface AnalyticsWebVitalsOptions {
  /**
   * How often to send web vitals metrics to Google Analytics (in ms)
   */
  reportingInterval?: number;
  
  /**
   * Whether to send debugging information
   */
  debug?: boolean;
  
  /**
   * Whether to include URL information with metrics
   */
  includePathname?: boolean;
  
  /**
   * Whether to auto-start sending metrics to Google Analytics
   * If false, you need to call start() manually
   */
  autoStart?: boolean;

  /**
   * Custom metrics to send in addition to the standard Core Web Vitals
   */
  additionalMetrics?: string[];
  
  /**
   * Whether to include device and connection information
   */
  includeDeviceInfo?: boolean;
}

/**
 * Class to manage sending Web Vitals metrics to Google Analytics
 */
class AnalyticsWebVitalsTracker {
  private options: Required<AnalyticsWebVitalsOptions>;
  private reportingIntervalId: number | null = null;
  private lastReportTimestamp = 0;
  private isInitialized = false;
  
  constructor(options: AnalyticsWebVitalsOptions = {}) {
    this.options = {
      reportingInterval: 60 * 1000, // Report every minute by default
      debug: false,
      includePathname: true,
      autoStart: true,
      additionalMetrics: ['TTI', 'FCP'],
      includeDeviceInfo: true,
      ...options
    };
    
    if (this.options.autoStart) {
      // Wait for window load before initializing
      if (document.readyState === 'complete') {
        this.initialize();
      } else {
        window.addEventListener('load', () => this.initialize(), { once: true });
      }
    }
  }
  
  /**
   * Initialize web vitals tracking with Google Analytics
   */
  private initialize(): void {
    if (this.isInitialized) {
      return;
    }
    
    try {
      // Configure additional metrics to track
      webVitalsMonitor.setOptions({
        reportToGoogleAnalytics: false, // We'll handle GA reporting manually
        debug: this.options.debug,
        reportAttribution: true,
      });
      
      // Start web vitals monitoring
      webVitalsMonitor.initialize();
      
      this.isInitialized = true;
      this.start();
      
      if (this.options.debug) {
        logger.debug('Analytics Web Vitals tracking initialized');
      }
    } catch (error) {
      logger.error('Failed to initialize Analytics Web Vitals tracking:', error);
    }
  }
  
  /**
   * Start sending metrics to Google Analytics
   */
  public start(): void {
    if (!this.isInitialized) {
      this.initialize();
      return;
    }
    
    this.lastReportTimestamp = Date.now();
    
    // Clear any existing intervals
    if (this.reportingIntervalId !== null) {
      window.clearInterval(this.reportingIntervalId);
    }
    
    // Set up interval to report metrics
    this.reportingIntervalId = window.setInterval(() => {
      this.reportMetricsToGoogleAnalytics();
    }, this.options.reportingInterval) as unknown as number;
    
    // Initial report
    this.reportMetricsToGoogleAnalytics();
    
    if (this.options.debug) {
      logger.debug('Web Vitals reporting to Google Analytics started');
    }
  }
  
  /**
   * Stop sending metrics to Google Analytics
   */
  public stop(): void {
    if (this.reportingIntervalId !== null) {
      window.clearInterval(this.reportingIntervalId);
      this.reportingIntervalId = null;
    }
    
    if (this.options.debug) {
      logger.debug('Web Vitals reporting to Google Analytics stopped');
    }
  }
  
  /**
   * Report metrics to Google Analytics
   */
  private reportMetricsToGoogleAnalytics(): void {
    try {
      const metrics = webVitalsMonitor.getFormattedMetrics();
      const coreWebVitals = ['LCP', 'FID', 'CLS', 'INP', 'TTFB'];
      const additionalMetrics = this.options.additionalMetrics || [];
      const metricsToTrack = [...coreWebVitals, ...additionalMetrics];
      
      // Count how many metrics we have
      let availableMetrics = 0;
      
      // Prepare parameters for Google Analytics
      const params: Record<string, any> = {};
      
      // Add metrics to params
      metricsToTrack.forEach(metricName => {
        const metric = metrics[metricName];
        if (metric && typeof metric.value === 'number') {
          availableMetrics++;
          
          // Convert to milliseconds for consistency if needed
          const value = metricName === 'CLS' ? metric.value.toFixed(4) : Math.round(metric.value);
          
          params[`metric_${metricName.toLowerCase()}`] = value;
          params[`metric_${metricName.toLowerCase()}_rating`] = metric.status;
          
          if (metric.attribution) {
            params[`metric_${metricName.toLowerCase()}_element`] = 
              metric.attribution.element || 'unknown';
          }
        }
      });
      
      // Skip sending if no metrics are available
      if (availableMetrics === 0) {
        if (this.options.debug) {
          logger.debug('No web vitals metrics available to report');
        }
        return;
      }
      
      // Add page URL if enabled
      if (this.options.includePathname) {
        params.page_path = window.location.pathname;
        params.page_title = document.title;
      }
      
      // Add device and connection information if enabled
      if (this.options.includeDeviceInfo) {
        const deviceInfo = getSimplifiedContextInfo();
        params.device_info = deviceInfo;
      }
      
      // Send the event to Google Analytics
      analytics.trackEvent({
        category: 'Web Vitals',
        action: 'update',
        label: `Web Vitals Report (${availableMetrics} metrics)`,
        nonInteraction: true,
        ...params
      });
      
      if (this.options.debug) {
        logger.debug('Reported web vitals to Google Analytics:', params);
      }
      
    } catch (error) {
      logger.error('Failed to report web vitals metrics to Google Analytics:', error);
    }
  }
  
  /**
   * Report a specific metric to Google Analytics immediately
   * Useful for real-time reporting of metrics as they come in
   */
  public reportMetric(metric: Metric): void {
    try {
      const params: Record<string, any> = {
        [`metric_${metric.name.toLowerCase()}`]: 
          metric.name === 'CLS' ? metric.value.toFixed(4) : Math.round(metric.value),
        [`metric_${metric.name.toLowerCase()}_rating`]: metric.status
      };
      
      if (metric.attribution) {
        params[`metric_${metric.name.toLowerCase()}_element`] = 
          metric.attribution.element || 'unknown';
      }
      
      // Add page URL if enabled
      if (this.options.includePathname) {
        params.page_path = window.location.pathname;
        params.page_title = document.title;
      }
      
      // Add device and connection information if enabled
      if (this.options.includeDeviceInfo) {
        const deviceInfo = getSimplifiedContextInfo();
        params.device_info = deviceInfo;
      }
      
      // Send the event to Google Analytics
      analytics.trackEvent({
        category: 'Web Vitals',
        action: 'metric',
        label: `${metric.name} (${metric.status})`,
        nonInteraction: true,
        ...params
      });
      
      if (this.options.debug) {
        logger.debug(`Reported ${metric.name} metric to Google Analytics:`, params);
      }
    } catch (error) {
      logger.error(`Failed to report ${metric.name} metric to Google Analytics:`, error);
    }
  }
  
  /**
   * Set options for the tracker
   */
  public setOptions(options: Partial<AnalyticsWebVitalsOptions>): void {
    this.options = { ...this.options, ...options };
    
    // If reporting interval changed and already running, restart
    if (options.reportingInterval !== undefined && this.reportingIntervalId !== null) {
      this.stop();
      this.start();
    }
  }
  
  /**
   * Get current options
   */
  public getOptions(): AnalyticsWebVitalsOptions {
    return { ...this.options };
  }
}

// Create a singleton instance
export const analyticsWebVitals = new AnalyticsWebVitalsTracker();

// Export the class for testing and custom instances
export { AnalyticsWebVitalsTracker };
export type { AnalyticsWebVitalsOptions }; 