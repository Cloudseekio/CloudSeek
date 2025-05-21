import React from 'react';
import useWebVitals from '../hooks/useWebVitals';

interface WebVitalsDisplayProps {
  /**
   * Page label or component name to track
   */
  pageLabel?: string;
  
  /**
   * Whether to show alerts
   */
  showAlerts?: boolean;
  
  /**
   * Whether to show debug information
   */
  debug?: boolean;
  
  /**
   * Whether to report metrics to analytics
   */
  reportToAnalytics?: boolean;
}

/**
 * Component to display Core Web Vitals metrics
 * This can be added to any page to track and visualize performance metrics
 */
const WebVitalsDisplay: React.FC<WebVitalsDisplayProps> = ({
  pageLabel = 'CurrentPage',
  showAlerts = true,
  debug = false,
  reportToAnalytics = true
}) => {
  const { metrics, alerts } = useWebVitals({
    pageLabel,
    debug,
    reportToAnalytics,
    enableAlerts: showAlerts,
    includeDeviceInfo: true
  });

  // Get color for metric status
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'needs-improvement': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format metric value
  const formatMetricValue = (name: string, value?: number) => {
    if (value === undefined) return 'N/A';
    if (name === 'cls') return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };
  
  // Define metrics to display
  const metricsToDisplay = [
    { name: 'lcp', label: 'LCP', tooltip: 'Largest Contentful Paint' },
    { name: 'fid', label: 'FID', tooltip: 'First Input Delay' },
    { name: 'cls', label: 'CLS', tooltip: 'Cumulative Layout Shift' },
    { name: 'inp', label: 'INP', tooltip: 'Interaction to Next Paint' },
    { name: 'fcp', label: 'FCP', tooltip: 'First Contentful Paint' },
    { name: 'ttfb', label: 'TTFB', tooltip: 'Time To First Byte' }
  ];

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">Web Vitals - {pageLabel}</h2>
      
      {/* Overall status */}
      {metrics.overallStatus && (
        <div className={`p-2 mb-4 rounded-md text-center ${getStatusColor(metrics.overallStatus)}`}>
          Overall Status: <span className="font-semibold">{metrics.overallStatus}</span>
        </div>
      )}
      
      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {metricsToDisplay.map(({ name, label, tooltip }) => (
          <div 
            key={name}
            className={`border p-2 rounded-md ${getStatusColor(metrics.status[name as keyof typeof metrics.status])}`}
            title={tooltip}
          >
            <div className="text-xs opacity-70">{tooltip}</div>
            <div className="flex justify-between items-center">
              <span className="font-bold">{label}</span>
              <span>{formatMetricValue(name, metrics[name as keyof typeof metrics])}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recent alerts */}
      {showAlerts && alerts.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Recent Alerts</h3>
          <div className="max-h-32 overflow-y-auto">
            {alerts.slice().reverse().map((alert, index) => (
              <div 
                key={`${alert.timestamp}-${index}`} 
                className={`mb-2 text-xs p-2 rounded-md ${
                  alert.severity === 'error' ? 'bg-red-50 text-red-900' :
                  alert.severity === 'warning' ? 'bg-yellow-50 text-yellow-900' :
                  'bg-blue-50 text-blue-900'
                }`}
              >
                <div className="font-bold">{alert.title}</div>
                <div>{alert.message}</div>
                {alert.metric && (
                  <div className="mt-1 opacity-80">
                    {alert.metric.name}: {alert.metric.value} (threshold: {alert.metric.threshold})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Debug info */}
      {debug && (
        <div className="mt-4 border-t pt-2 text-xs text-gray-500">
          <div>Debug mode: On</div>
          <div>Reporting to Analytics: {reportToAnalytics ? 'On' : 'Off'}</div>
        </div>
      )}
    </div>
  );
};

export default WebVitalsDisplay; 