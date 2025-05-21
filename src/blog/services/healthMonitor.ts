import logger from '../../utils/logger';
import { getContentfulService } from './serviceFactory';

export type ServiceStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
export type ServiceName = 'contentful' | 'image' | 'cache';

interface HealthMetrics {
  responseTime: number;
  errorCount: number;
  successCount: number;
  lastCheck: number;
  uptime: number;
}

interface ServiceHealth {
  status: ServiceStatus;
  lastUpdated: number;
  metrics: HealthMetrics;
  error?: string;
}

interface PerformanceMetrics {
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  errorRate: number;
  requestsPerMinute: number;
}

export class HealthMonitor {
  private static instance: HealthMonitor;
  private healthChecks: Map<ServiceName, ServiceHealth>;
  private performanceMetrics: Map<ServiceName, PerformanceMetrics>;
  private checkIntervals: Map<ServiceName, NodeJS.Timeout>;
  private startTime: number;
  private readonly DEFAULT_CHECK_INTERVAL = 60000; // 1 minute
  private readonly METRICS_WINDOW = 3600000; // 1 hour
  private responseTimes: Map<ServiceName, number[]>;

  private constructor() {
    this.healthChecks = new Map();
    this.performanceMetrics = new Map();
    this.checkIntervals = new Map();
    this.responseTimes = new Map();
    this.startTime = Date.now();
    this.initializeServices();
  }

  static getInstance(): HealthMonitor {
    if (!HealthMonitor.instance) {
      HealthMonitor.instance = new HealthMonitor();
    }
    return HealthMonitor.instance;
  }

  private initializeServices() {
    this.startMonitoring('contentful');
    this.startMonitoring('image');
    this.startMonitoring('cache');
  }

  private async checkServiceHealth(service: ServiceName): Promise<ServiceHealth> {
    const startTime = Date.now();
    let status: ServiceStatus = 'unknown';
    let error: string | undefined;

    try {
      const contentfulService = getContentfulService();
      let connectionStatus;
      let cacheStats;

      switch (service) {
        case 'contentful':
          connectionStatus = await contentfulService.getConnectionStatus();
          status = connectionStatus.isConnected ? 'healthy' : 'unhealthy';
          if (!connectionStatus.isConnected) {
            error = 'Contentful service is not connected';
          }
          break;
        case 'cache':
          cacheStats = contentfulService.getCacheStats();
          status = cacheStats ? 'healthy' : 'degraded';
          break;
        case 'image':
          // Add image service health check
          status = 'healthy'; // Placeholder
          break;
      }
    } catch (err) {
      status = 'unhealthy';
      error = err instanceof Error ? err.message : 'Unknown error occurred';
      logger.error(`Health check failed for ${service}:`, err);
    }

    const responseTime = Date.now() - startTime;
    this.updateResponseTimes(service, responseTime);

    const metrics = this.updateMetrics(service, status === 'healthy', responseTime);

    return {
      status,
      lastUpdated: Date.now(),
      metrics,
      error
    };
  }

  private updateResponseTimes(service: ServiceName, responseTime: number) {
    if (!this.responseTimes.has(service)) {
      this.responseTimes.set(service, []);
    }
    const times = this.responseTimes.get(service)!;
    times.push(responseTime);

    // Keep only the last hour of response times
    const cutoff = Date.now() - this.METRICS_WINDOW;
    while (times.length > 0 && times[0] < cutoff) {
      times.shift();
    }
  }

  private updateMetrics(service: ServiceName, isSuccess: boolean, responseTime: number): HealthMetrics {
    const current = this.healthChecks.get(service)?.metrics || {
      responseTime: 0,
      errorCount: 0,
      successCount: 0,
      lastCheck: 0,
      uptime: 0
    };

    return {
      responseTime,
      errorCount: isSuccess ? current.errorCount : current.errorCount + 1,
      successCount: isSuccess ? current.successCount + 1 : current.successCount,
      lastCheck: Date.now(),
      uptime: Date.now() - this.startTime
    };
  }

  private calculatePerformanceMetrics(service: ServiceName): PerformanceMetrics {
    const times = this.responseTimes.get(service) || [];
    const sortedTimes = [...times].sort((a, b) => a - b);
    const total = times.length;

    return {
      avgResponseTime: total ? times.reduce((a, b) => a + b, 0) / total : 0,
      p95ResponseTime: total ? sortedTimes[Math.floor(total * 0.95)] : 0,
      p99ResponseTime: total ? sortedTimes[Math.floor(total * 0.99)] : 0,
      errorRate: this.calculateErrorRate(service),
      requestsPerMinute: this.calculateRequestRate(service)
    };
  }

  private calculateErrorRate(service: ServiceName): number {
    const health = this.healthChecks.get(service);
    if (!health) return 0;
    const total = health.metrics.successCount + health.metrics.errorCount;
    return total ? (health.metrics.errorCount / total) * 100 : 0;
  }

  private calculateRequestRate(service: ServiceName): number {
    const health = this.healthChecks.get(service);
    if (!health) return 0;
    const total = health.metrics.successCount + health.metrics.errorCount;
    const timeWindow = (Date.now() - this.startTime) / 60000; // Convert to minutes
    return timeWindow ? total / timeWindow : 0;
  }

  startMonitoring(service: ServiceName, interval: number = this.DEFAULT_CHECK_INTERVAL) {
    // Clear existing interval if any
    this.stopMonitoring(service);

    // Perform initial check
    this.checkServiceHealth(service).then(health => {
      this.healthChecks.set(service, health);
      this.performanceMetrics.set(service, this.calculatePerformanceMetrics(service));
    });

    // Set up periodic checks
    const checkInterval = setInterval(async () => {
      const health = await this.checkServiceHealth(service);
      this.healthChecks.set(service, health);
      this.performanceMetrics.set(service, this.calculatePerformanceMetrics(service));
    }, interval);

    this.checkIntervals.set(service, checkInterval);
  }

  stopMonitoring(service: ServiceName) {
    const interval = this.checkIntervals.get(service);
    if (interval) {
      clearInterval(interval);
      this.checkIntervals.delete(service);
    }
  }

  getServiceHealth(service: ServiceName): ServiceHealth | undefined {
    return this.healthChecks.get(service);
  }

  getServicePerformance(service: ServiceName): PerformanceMetrics | undefined {
    return this.performanceMetrics.get(service);
  }

  getAllServicesHealth(): Map<ServiceName, ServiceHealth> {
    return new Map(this.healthChecks);
  }

  getAllServicesPerformance(): Map<ServiceName, PerformanceMetrics> {
    return new Map(this.performanceMetrics);
  }
} 