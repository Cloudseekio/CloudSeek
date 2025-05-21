import { useEffect, useState } from 'react';
import { webVitalsMonitor, Metric, MetricStatus } from '../utils/webVitalsMonitoring';
import { analyticsWebVitals } from '../utils/analyticsWebVitals';
import { performanceAlerts, PerformanceAlert } from '../utils/performanceAlerts';

interface UseWebVitalsOptions {
  /**
   * Whether to enable debug logging
   */
  debug?: boolean;
  
  /**
   * Name of the page or component being monitored
   */
  pageLabel?: string;
  
  /**
   * Whether to report metrics to Google Analytics
   */
  reportToAnalytics?: boolean;
  
  /**
   * Whether to receive alerts for poor performance
   */
  enableAlerts?: boolean;
  
  /**
   * Whether to include device and connection information
   */
  includeDeviceInfo?: boolean;
  
  /**
   * Custom callback for metric updates
   */
  onMetricUpdate?: (metric: Metric) => void;
  
  /**
   * Custom callback for performance alerts
   */
  onAlert?: (alert: PerformanceAlert) => void;
}

interface WebVitalsData {
  /**
   * Latest LCP (Largest Contentful Paint) value in ms
   */
  lcp?: number;
  
  /**
   * Latest FID (First Input Delay) value in ms
   */
  fid?: number;
  
  /**
   * Latest CLS (Cumulative Layout Shift) value
   */
  cls?: number;
  
  /**
   * Latest INP (Interaction to Next Paint) value in ms
   */
  inp?: number;
  
  /**
   * Latest FCP (First Contentful Paint) value in ms
   */
  fcp?: number;
  
  /**
   * Latest TTFB (Time to First Byte) value in ms
   */
  ttfb?: number;
  
  /**
   * Status for each metric (good, needs-improvement, poor)
   */
  status: {
    lcp?: MetricStatus;
    fid?: MetricStatus;
    cls?: MetricStatus;
    inp?: MetricStatus;
    fcp?: MetricStatus;
    ttfb?: MetricStatus;
  };
  
  /**
   * Overall status based on all metrics
   */
  overallStatus?: MetricStatus;
}

/**
 * React hook for tracking and reporting Core Web Vitals
 * 
 * @example
 * ```tsx
 * const { metrics, alerts } = useWebVitals({ 
 *   pageLabel: 'HomePage',
 *   enableAlerts: true
 * });
 * 
 * // Component can display metrics or alerts
 * return (
 *   <div>
 *     {metrics.lcp && <span>LCP: {metrics.lcp}ms ({metrics.status.lcp})</span>}
 *     {alerts.map(alert => (
 *       <div key={alert.timestamp}>
 *         {alert.title}: {alert.message}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useWebVitals(options: UseWebVitalsOptions = {}) {
  const [metrics, setMetrics] = useState<WebVitalsData>({ status: {} });
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  
  useEffect(() => {
    // Initialize monitoring
    webVitalsMonitor.initialize({
      debug: options.debug,
      reportAttribution: true,
      includeDeviceInfo: options.includeDeviceInfo ?? true,
      reportToAnalytics: options.reportToAnalytics ?? true,
      onMetric: (metric) => {
        // Update component state
        setMetrics(current => {
          const formattedMetric = metric as any;
          const metricName = metric.name.toLowerCase();
          
          // Get status if available
          const status = formattedMetric.status || current.status[metricName];
          
          // Update metrics object
          const updatedMetrics = {
            ...current,
            [metricName]: metric.value,
            status: {
              ...current.status,
              [metricName]: status
            }
          };
          
          // Calculate overall status
          const statuses = Object.values(updatedMetrics.status);
          let overallStatus: MetricStatus = 'good';
          
          if (statuses.includes('poor')) {
            overallStatus = 'poor';
          } else if (statuses.includes('needs-improvement')) {
            overallStatus = 'needs-improvement';
          }
          
          updatedMetrics.overallStatus = overallStatus;
          
          // Call custom callback if provided
          options.onMetricUpdate?.(metric);
          
          return updatedMetrics;
        });
      }
    });
    
    // Setup alerts if enabled
    if (options.enableAlerts) {
      performanceAlerts.start();
      
      // Handle alerts
      const handleAlert = (alert: PerformanceAlert) => {
        setAlerts(current => [...current, alert]);
        options.onAlert?.(alert);
      };
      
      // Add custom callback
      const originalOnAlert = performanceAlerts.options.onAlert;
      performanceAlerts.setOptions({
        onAlert: (alert) => {
          // Call original callback
          if (originalOnAlert) originalOnAlert(alert);
          
          // Call our callback
          handleAlert(alert);
        }
      });
    }
    
    // Report to Google Analytics if enabled
    if (options.reportToAnalytics) {
      analyticsWebVitals.setOptions({
        debug: options.debug,
        includePathname: true,
        includeDeviceInfo: options.includeDeviceInfo ?? true,
        autoStart: true
      });
    }
    
    // Cleanup
    return () => {
      // Stop alerts if started
      if (options.enableAlerts) {
        performanceAlerts.stop();
      }
    };
  }, [
    options.debug, 
    options.pageLabel, 
    options.reportToAnalytics, 
    options.enableAlerts,
    options.includeDeviceInfo, 
    options.onMetricUpdate, 
    options.onAlert
  ]);
  
  return { metrics, alerts };
}

export default useWebVitals; 