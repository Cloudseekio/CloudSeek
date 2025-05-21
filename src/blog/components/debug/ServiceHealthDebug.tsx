import React, { useEffect, useState } from 'react';
import { HealthMonitor, ServiceName, ServiceStatus } from '../../services/healthMonitor';
import { Activity, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';

interface ServiceHealthDebugProps {
  className?: string;
  showDetails?: boolean;
}

interface ServiceHealth {
  status: ServiceStatus;
  lastUpdated: number;
  metrics: {
    responseTime: number;
    errorCount: number;
    successCount: number;
    lastCheck: number;
    uptime: number;
  };
  error?: string;
}

interface PerformanceMetrics {
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  requestsPerMinute: number;
}

const ServiceHealthDebug: React.FC<ServiceHealthDebugProps> = ({ 
  className = '',
  showDetails = false
}) => {
  const [monitor] = useState(() => HealthMonitor.getInstance());
  const [healthData, setHealthData] = useState<Map<ServiceName, ServiceHealth>>(new Map());
  const [performanceData, setPerformanceData] = useState<Map<ServiceName, PerformanceMetrics>>(new Map());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = () => {
    setHealthData(monitor.getAllServicesHealth());
    setPerformanceData(monitor.getAllServicesPerformance());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'unhealthy': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Service Health Monitor
          </h2>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
              ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Refresh service health data"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-6">
          {Array.from(healthData.entries()).map(([service, health]) => {
            const performance = performanceData.get(service);
            
            return (
              <div key={service} className="border dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium capitalize">{service}</h3>
                  <span className={`flex items-center ${getStatusColor(health.status)}`}>
                    {health.status === 'healthy' && <CheckCircle className="w-5 h-5 mr-1" />}
                    {health.status === 'degraded' && <AlertCircle className="w-5 h-5 mr-1" />}
                    {health.status === 'unhealthy' && <AlertCircle className="w-5 h-5 mr-1" />}
                    {health.status === 'unknown' && <Activity className="w-5 h-5 mr-1" />}
                    {health.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Uptime: {formatDuration(health.metrics.uptime)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Success Rate: {formatNumber(100 - (performance?.errorRate || 0))}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Requests/min: {formatNumber(performance?.requestsPerMinute || 0)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Avg Response: {formatNumber(performance?.avgResponseTime || 0)}ms
                    </div>
                    {showDetails && (
                      <>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          P95 Response: {formatNumber(performance?.p95ResponseTime || 0)}ms
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          P99 Response: {formatNumber(performance?.p99ResponseTime || 0)}ms
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {showDetails && (
                  <div className="mt-4 space-y-3 border-t dark:border-gray-700 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Requests: {formatNumber(health.metrics.successCount + health.metrics.errorCount)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Error Count: {formatNumber(health.metrics.errorCount)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Last Updated: {new Date(health.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                )}

                {health.error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-sm">
                    {health.error}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceHealthDebug; 