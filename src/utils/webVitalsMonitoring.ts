import {
  onCLS,
  onFID,
  onLCP,
  onFCP,
  onTTFB,
  onINP,
  Metric
} from './web-vitals';
import { performanceMonitor } from './performanceMonitoring';
import { trackEvent } from './analytics';
import { EventCategories, EventActions } from './analyticsConfig';
import { getSimplifiedContextInfo } from './deviceInfo';

interface WebVitalsOptions {
  /**
   * Whether to report metrics to Google Analytics
   */
  reportToAnalytics?: boolean;
  
  /**
   * Whether to report metrics to the console in development
   */
  debug?: boolean;
  
  /**
   * Whether to include details on attribution
   */
  reportAttribution?: boolean;
  
  /**
   * Custom callback for handling metrics
   */
  onMetric?: (metric: Metric) => void;
  
  /**
   * Whether to use performance observer polyfill
   */
  usePolyfill?: boolean;
  
  /**
   * Whether to include device and connection info
   */
  includeDeviceInfo?: boolean;
}

/**
 * Web Vitals status based on Core Web Vitals thresholds
 */
export type MetricStatus = 'good' | 'needs-improvement' | 'poor';

/**
 * Web Vitals score thresholds per Google's Core Web Vitals guidelines
 */
const THRESHOLDS = {
  LCP: {
    good: 2500,
    poor: 4000
  },
  FID: {
    good: 100,
    poor: 300
  },
  CLS: {
    good: 0.1,
    poor: 0.25
  },
  FCP: {
    good: 1800,
    poor: 3000
  },
  TTFB: {
    good: 800,
    poor: 1800
  },
  INP: {
    good: 200,
    poor: 500
  }
};

/**
 * Get status of metric based on value and thresholds
 */
function getMetricStatus(name: string, value: number): MetricStatus {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  
  if (!threshold) {
    return 'needs-improvement';
  }
  
  if (value <= threshold.good) {
    return 'good';
  } else if (value <= threshold.poor) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
}

/**
 * Format Web Vitals data for metric reporting
 */
function getMetricPayload(metric: Metric): Record<string, any> {
  const { name, value, id, navigationType } = metric;

  // Basic payload
  const payload: Record<string, any> = {
    name,
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    unit: name === 'CLS' ? 'unitless * 1000' : 'ms',
    id,
    page: window.location.pathname,
    status: getMetricStatus(name, value),
    navigationType: navigationType
  };

  // Add attribution data if available
  if ((metric as any).attribution) {
    const attribution = (metric as any).attribution;
    
    payload.attribution = {
      element: attribution.element || '',
      type: attribution.type || '',
      url: attribution.url || '',
      navigationEntry: attribution.navigationEntry || ''
    };
  }

  return payload;
}

class WebVitalsMonitor {
  private options: Required<WebVitalsOptions>;
  private metricsCollected = new Set<string>();
  private metricsData: Record<string, Metric> = {};

  constructor(options: WebVitalsOptions = {}) {
    this.options = {
      reportToAnalytics: true,
      debug: process.env.NODE_ENV === 'development',
      reportAttribution: true,
      onMetric: undefined,
      usePolyfill: false,
      includeDeviceInfo: true,
      ...options
    };
  }

  /**
   * Initialize monitoring with updated options
   */
  public initialize(options?: Partial<WebVitalsOptions>): void {
    // Update options if provided
    if (options) {
      this.options = {
        ...this.options,
        ...options
      };
    }
    
    // Initialize monitoring
    this.init();
  }

  /**
   * Update options without reinitializing
   */
  public setOptions(options: Partial<WebVitalsOptions>): void {
    this.options = {
      ...this.options,
      ...options
    };
  }

  /**
   * Initialize monitoring of all core web vitals
   */
  public init(): void {
    this.metricsCollected.clear();
    this.metricsData = {};

    // Measure First Input Delay (FID)
    onFID(metric => this.handleMetric(metric));

    // Measure Largest Contentful Paint (LCP)
    onLCP(metric => this.handleMetric(metric));

    // Measure Cumulative Layout Shift (CLS)
    onCLS(metric => this.handleMetric(metric));

    // Measure First Contentful Paint (FCP)
    onFCP(metric => this.handleMetric(metric));

    // Measure Time to First Byte (TTFB)
    onTTFB(metric => this.handleMetric(metric));

    // Measure Interaction to Next Paint (INP)
    onINP(metric => this.handleMetric(metric));
    
    if (this.options.debug) {
      console.log('[WebVitals] Monitoring initialized');
    }
  }

  /**
   * Handle a metric reported by web-vitals
   */
  private handleMetric(metric: Metric): void {
    const { name, value, id } = metric;
    
    // Store metric data
    this.metricsData[name] = metric;
    this.metricsCollected.add(name);
    
    // Format metric for reporting
    const formattedMetric = getMetricPayload(metric);
    const status = formattedMetric.status;
    
    // Add device and connection info if enabled
    if (this.options.includeDeviceInfo) {
      formattedMetric.context = getSimplifiedContextInfo();
    }
    
    // Log to console in debug mode
    if (this.options.debug) {
      const color = 
        status === 'good' ? 'color: green;' :
        status === 'needs-improvement' ? 'color: orange;' : 
        'color: red;';
        
      console.log(
        `%c[WebVitals] ${name}: ${value.toFixed(2)} (${status})`, 
        color,
        formattedMetric
      );
    }
    
    // Record in performance monitor
    performanceMonitor.record(
      `web_vitals.${name.toLowerCase()}`,
      name === 'CLS' ? value * 1000 : value,
      name === 'CLS' ? 'count' : 'ms',
      {
        id,
        status,
        navigation_type: metric.navigationType || 'unknown',
        ...(this.options.includeDeviceInfo ? { 
          device_type: formattedMetric.context?.device_type, 
          connection_type: formattedMetric.context?.effective_connection 
        } : {})
      }
    );
    
    // Report to Google Analytics if enabled
    if (this.options.reportToAnalytics) {
      this.reportToAnalytics(formattedMetric);
    }
    
    // Call custom callback if provided
    this.options.onMetric?.(metric);
    
    // If all initial metrics collected, report a summary
    const coreMetrics = ['LCP', 'FID', 'CLS', 'FCP'];
    if (
      coreMetrics.every(metricName => this.metricsCollected.has(metricName)) && 
      this.metricsCollected.has('TTFB')
    ) {
      this.reportMetricSummary();
    }
  }
  
  /**
   * Report combined metrics summary
   */
  private reportMetricSummary(): void {
    const summary = {
      scores: {
        lcp: this.metricsData['LCP']?.value || 0,
        fid: this.metricsData['FID']?.value || 0,
        cls: this.metricsData['CLS']?.value || 0,
        fcp: this.metricsData['FCP']?.value || 0,
        ttfb: this.metricsData['TTFB']?.value || 0,
        inp: this.metricsData['INP']?.value || 0,
      },
      status: {
        lcp: getMetricStatus('LCP', this.metricsData['LCP']?.value || 0),
        fid: getMetricStatus('FID', this.metricsData['FID']?.value || 0),
        cls: getMetricStatus('CLS', this.metricsData['CLS']?.value || 0),
        fcp: getMetricStatus('FCP', this.metricsData['FCP']?.value || 0),
        ttfb: getMetricStatus('TTFB', this.metricsData['TTFB']?.value || 0),
        inp: getMetricStatus('INP', this.metricsData['INP']?.value || 0),
      },
      navigationType: this.metricsData['LCP']?.navigationType || 'unknown',
      page: window.location.pathname
    };
    
    // Calculate overall score
    const scores = Object.values(summary.status);
    let overallStatus: MetricStatus = 'good';
    
    if (scores.includes('poor')) {
      overallStatus = 'poor';
    } else if (scores.includes('needs-improvement')) {
      overallStatus = 'needs-improvement';
    }
    
    const fullSummary = {
      ...summary,
      overallStatus
    };
    
    // Log summary
    if (this.options.debug) {
      console.log(`%c[WebVitals] Summary (${overallStatus})`, 
        overallStatus === 'good' ? 'color: green; font-weight: bold' :
        overallStatus === 'needs-improvement' ? 'color: orange; font-weight: bold' :
        'color: red; font-weight: bold',
        fullSummary
      );
    }
    
    // Report summary to analytics
    if (this.options.reportToAnalytics) {
      trackEvent(
        'web_vitals_summary',
        EventCategories.CONTENT,
        EventActions.VIEW,
        {
          scores: summary.scores,
          statuses: summary.status,
          overall_status: overallStatus,
          navigation_type: summary.navigationType,
          page: summary.page
        }
      );
    }
  }
  
  /**
   * Report a metric to Google Analytics
   */
  private reportToAnalytics(metric: Record<string, any>): void {
    // Build base parameters
    const params: Record<string, any> = {
      // Convert to object with snake_case keys for GA
      value: metric.value,
      metric_id: metric.id,
      metric_status: metric.status,
      navigation_type: metric.navigationType,
      url: metric.page
    };
    
    // Add attribution data if available
    if (metric.attribution && this.options.reportAttribution) {
      params.attribution_element = metric.attribution.element || 'unknown';
      params.attribution_type = metric.attribution.type || 'unknown';
      params.attribution_url = metric.attribution.url || 'unknown';
    }
    
    // Add device and connection info if available
    if (metric.context) {
      // Add important device context
      params.device_type = metric.context.device_type;
      params.os = metric.context.os;
      params.browser = metric.context.browser;
      
      // Add connection info
      params.connection_type = metric.context.connection_type;
      params.effective_connection = metric.context.effective_connection;
      params.downlink_mbps = metric.context.downlink_mbps;
      params.rtt_ms = metric.context.rtt_ms;
    }
    
    // Send the event to Google Analytics
    trackEvent(
      `web_vitals_${metric.name.toLowerCase()}`,
      EventCategories.CONTENT,
      EventActions.VIEW,
      params
    );
  }
  
  /**
   * Get current metrics data
   */
  public getMetrics(): Record<string, Metric> {
    return { ...this.metricsData };
  }
  
  /**
   * Get formatted metrics data for reporting
   */
  public getFormattedMetrics(): Record<string, any> {
    const formatted: Record<string, any> = {};
    
    Object.entries(this.metricsData).forEach(([name, metric]) => {
      formatted[name] = getMetricPayload(metric);
    });
    
    return formatted;
  }
}

// Create a singleton instance
export const webVitalsMonitor = new WebVitalsMonitor();

// Export the class for testing or custom instances
export { WebVitalsMonitor };
export type { WebVitalsOptions, Metric }; 