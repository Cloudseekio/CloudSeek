import { useEffect, useRef, useCallback, useState } from 'react';

interface NetworkMetrics {
  // Network conditions
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  downlink: number;
  rtt: number;
  // Connection status
  isOnline: boolean;
  saveData: boolean;
  // Performance metrics
  lastLoadTime: number;
  averageLoadTime: number;
  failureRate: number;
}

interface AdaptiveStrategy {
  // Content quality
  imageQuality: number;
  maxImageDimension: number;
  // Loading behavior
  prefetchDistance: number;
  batchSize: number;
  retryAttempts: number;
  // Timeouts
  loadTimeout: number;
  retryDelay: number;
}

interface AdaptiveOptions {
  // Strategy overrides
  strategy?: Partial<AdaptiveStrategy>;
  // Network condition thresholds
  thresholds?: {
    rtt?: number;
    downlink?: number;
  };
  // Callbacks
  onStrategyChange?: (strategy: AdaptiveStrategy) => void;
  onNetworkChange?: (metrics: NetworkMetrics) => void;
}

const defaultStrategy: AdaptiveStrategy = {
  imageQuality: 80,
  maxImageDimension: 1200,
  prefetchDistance: 3,
  batchSize: 10,
  retryAttempts: 3,
  loadTimeout: 10000,
  retryDelay: 2000,
};

const defaultThresholds = {
  rtt: 500, // ms
  downlink: 1.5, // Mbps
};

// Network Information API types
interface NetworkInformation {
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  readonly downlink: number;
  readonly rtt: number;
  readonly saveData: boolean;
  readonly type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
  readonly downlinkMax: number;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

declare global {
  interface Navigator {
    readonly connection?: NetworkInformation;
  }
}

/**
 * Hook for implementing adaptive loading
 */
export function useAdaptiveLoading(options: AdaptiveOptions = {}) {
  const {
    strategy: strategyOverrides = {},
    thresholds = defaultThresholds,
    onStrategyChange,
    onNetworkChange,
  } = options;

  // State for network metrics
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
    isOnline: true,
    saveData: false,
    lastLoadTime: 0,
    averageLoadTime: 0,
    failureRate: 0,
  });

  // Refs for tracking performance
  const performanceRef = useRef({
    loadTimes: [] as number[],
    failures: 0,
    totalRequests: 0,
  });

  // Calculate adaptive strategy based on network conditions
  const calculateStrategy = useCallback((): AdaptiveStrategy => {
    const {
      effectiveType,
      downlink,
      rtt,
      saveData,
      failureRate,
    } = metrics;

    let strategy = { ...defaultStrategy, ...strategyOverrides };

    // Adjust for save-data mode
    if (saveData) {
      strategy = {
        ...strategy,
        imageQuality: 60,
        maxImageDimension: 800,
        prefetchDistance: 1,
        batchSize: 5,
      };
      return strategy;
    }

    // Adjust for network conditions
    if ((thresholds.rtt ?? defaultThresholds.rtt) < rtt || 
        (thresholds.downlink ?? defaultThresholds.downlink) > downlink) {
      strategy = {
        ...strategy,
        imageQuality: 70,
        maxImageDimension: 1000,
        prefetchDistance: 2,
        batchSize: 5,
        retryDelay: 3000,
      };
    }

    // Adjust for connection type
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        strategy = {
          ...strategy,
          imageQuality: 50,
          maxImageDimension: 600,
          prefetchDistance: 1,
          batchSize: 3,
          retryDelay: 4000,
        };
        break;
      case '3g':
        strategy = {
          ...strategy,
          imageQuality: 70,
          maxImageDimension: 800,
          prefetchDistance: 2,
          batchSize: 5,
          retryDelay: 3000,
        };
        break;
      default: // 4g
        // Use default strategy
        break;
    }

    // Adjust for failure rate
    if (failureRate > 0.1) { // More than 10% failures
      strategy = {
        ...strategy,
        retryAttempts: Math.min(5, strategy.retryAttempts + 1),
        retryDelay: Math.min(5000, strategy.retryDelay * 1.5),
        batchSize: Math.max(3, strategy.batchSize - 2),
      };
    }

    return strategy;
  }, [metrics, strategyOverrides, thresholds]);

  // Update network metrics
  const updateNetworkMetrics = useCallback(() => {
    if (!navigator.connection) return;

    const connection = navigator.connection;
    const newMetrics: NetworkMetrics = {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      isOnline: navigator.onLine,
      saveData: connection.saveData,
      lastLoadTime: metrics.lastLoadTime,
      averageLoadTime: metrics.averageLoadTime,
      failureRate: metrics.failureRate,
    };

    setMetrics(newMetrics);
    onNetworkChange?.(newMetrics);

    // Update strategy if needed
    const newStrategy = calculateStrategy();
    onStrategyChange?.(newStrategy);
  }, [metrics, calculateStrategy, onNetworkChange, onStrategyChange]);

  // Track request performance
  const trackPerformance = useCallback((
    duration: number,
    success: boolean
  ) => {
    const { loadTimes, failures, totalRequests } = performanceRef.current;

    // Update load times
    loadTimes.push(duration);
    if (loadTimes.length > 10) loadTimes.shift();

    // Update success/failure counts
    performanceRef.current.totalRequests = totalRequests + 1;
    if (!success) {
      performanceRef.current.failures = failures + 1;
    }

    // Calculate new metrics
    const averageLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length;
    const failureRate = performanceRef.current.failures / performanceRef.current.totalRequests;

    setMetrics(prev => ({
      ...prev,
      lastLoadTime: duration,
      averageLoadTime,
      failureRate,
    }));
  }, []);

  // Set up network monitoring
  useEffect(() => {
    updateNetworkMetrics();

    // Listen for network changes
    window.addEventListener('online', updateNetworkMetrics);
    window.addEventListener('offline', updateNetworkMetrics);

    const connection = navigator.connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkMetrics);
    }

    return () => {
      window.removeEventListener('online', updateNetworkMetrics);
      window.removeEventListener('offline', updateNetworkMetrics);

      if (connection) {
        connection.removeEventListener('change', updateNetworkMetrics);
      }
    };
  }, [updateNetworkMetrics]);

  // Create adaptive fetch wrapper
  const adaptiveFetch = useCallback(async <T>(
    fetcher: () => Promise<T>,
    options: {
      priority?: 'high' | 'medium' | 'low';
      timeout?: number;
    } = {}
  ): Promise<T> => {
    const strategy = calculateStrategy();
    const startTime = Date.now();
    let attempts = 0;

    const tryFetch = async (): Promise<T> => {
      try {
        // Add timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('Request timeout'));
          }, options.timeout || strategy.loadTimeout);
        });

        // Execute fetch with timeout
        const result = await Promise.race([
          fetcher(),
          timeoutPromise,
        ]);

        // Track successful performance
        trackPerformance(Date.now() - startTime, true);
        return result;
      } catch (error) {
        attempts++;
        trackPerformance(Date.now() - startTime, false);

        // Retry if attempts remain
        if (attempts < strategy.retryAttempts) {
          await new Promise(resolve => 
            setTimeout(resolve, strategy.retryDelay * attempts)
          );
          return tryFetch();
        }
        throw error;
      }
    };

    return tryFetch();
  }, [calculateStrategy, trackPerformance]);

  return {
    // Current state
    metrics,
    strategy: calculateStrategy(),
    // Utilities
    adaptiveFetch,
    trackPerformance,
    // Network status
    isOnline: metrics.isOnline,
    saveData: metrics.saveData,
  };
} 