/**
 * Performance Integration Module
 * 
 * This module integrates all performance monitoring utilities:
 * - Performance Monitor - General performance tracking
 * - Web Vitals Monitor - Core Web Vitals tracking
 * - Performance Alerts - Alerts for performance regressions
 * - Analytics Web Vitals - Reporting to Google Analytics
 */

import { performanceMonitor } from './performanceMonitoring';
import { webVitalsMonitor } from './webVitalsMonitoring';
import { performanceAlerts } from './performanceAlerts';
import { analyticsWebVitals } from './analyticsWebVitals';
import logger from './logger';
import { useEffect } from 'react';

// Types for performance initialization options
interface PerformanceIntegrationOptions {
  /**
   * Whether to enable detailed debugging
   */
  debug?: boolean;
  
  /**
   * Performance monitoring options
   */
  monitor?: {
    /**
     * Whether to enable performance monitoring
     */
    enabled?: boolean;
    
    /**
     * Sampling rate for performance metrics (0-1)
     */
    sampleRate?: number;
    
    /**
     * Maximum events to store
     */
    maxEvents?: number;
  };
  
  /**
   * Web vitals monitoring options
   */
  webVitals?: {
    /**
     * Whether to enable web vitals monitoring
     */
    enabled?: boolean;
    
    /**
     * Whether to report attribution data
     */
    reportAttribution?: boolean;
  };
  
  /**
   * Performance alerts options
   */
  alerts?: {
    /**
     * Whether to enable performance alerts
     */
    enabled?: boolean;
    
    /**
     * How often to check for performance regressions (in ms)
     */
    checkInterval?: number;
    
    /**
     * Whether to log alerts to the console
     */
    logToConsole?: boolean;
  };
  
  /**
   * Google Analytics reporting options
   */
  analytics?: {
    /**
     * Whether to enable reporting to Google Analytics
     */
    enabled?: boolean;
    
    /**
     * How often to report web vitals to Google Analytics (in ms)
     */
    reportingInterval?: number;
    
    /**
     * Whether to include URL information with metrics
     */
    includePathname?: boolean;
  };
}

// Default options
const DEFAULT_OPTIONS: Required<PerformanceIntegrationOptions> = {
  debug: false,
  monitor: {
    enabled: true,
    sampleRate: 0.1, // Sample 10% of metrics by default
    maxEvents: 1000,
  },
  webVitals: {
    enabled: true,
    reportAttribution: true,
  },
  alerts: {
    enabled: true,
    checkInterval: 60 * 1000, // Check every minute
    logToConsole: true,
  },
  analytics: {
    enabled: true,
    reportingInterval: 120 * 1000, // Report every 2 minutes
    includePathname: true,
  },
};

/**
 * Initialize all performance monitoring utilities
 */
function initializePerformanceMonitoring(
  options: PerformanceIntegrationOptions = {}
): void {
  // Merge options with defaults
  const mergedOptions = mergeOptions(DEFAULT_OPTIONS, options);
  
  try {
    if (mergedOptions.debug) {
      logger.info('Initializing performance monitoring');
    }
    
    // Initialize performance monitor
    if (mergedOptions.monitor.enabled) {
      performanceMonitor.setOptions({
        sampleRate: mergedOptions.monitor.sampleRate,
        maxEvents: mergedOptions.monitor.maxEvents,
        debug: mergedOptions.debug,
      });
      
      if (mergedOptions.debug) {
        logger.debug('Performance monitor initialized');
      }
    }
    
    // Initialize web vitals monitor
    if (mergedOptions.webVitals.enabled) {
      webVitalsMonitor.setOptions({
        debug: mergedOptions.debug,
        reportAttribution: mergedOptions.webVitals.reportAttribution,
      });
      
      webVitalsMonitor.initialize();
      
      if (mergedOptions.debug) {
        logger.debug('Web vitals monitor initialized');
      }
    }
    
    // Initialize performance alerts
    if (mergedOptions.alerts.enabled) {
      performanceAlerts.setOptions({
        checkInterval: mergedOptions.alerts.checkInterval,
        logToConsole: mergedOptions.alerts.logToConsole,
        debug: mergedOptions.debug,
      });
      
      performanceAlerts.start();
      
      if (mergedOptions.debug) {
        logger.debug('Performance alerts initialized');
      }
    }
    
    // Initialize analytics web vitals
    if (mergedOptions.analytics.enabled) {
      analyticsWebVitals.setOptions({
        reportingInterval: mergedOptions.analytics.reportingInterval,
        includePathname: mergedOptions.analytics.includePathname,
        debug: mergedOptions.debug,
        autoStart: true,
      });
      
      if (mergedOptions.debug) {
        logger.debug('Analytics web vitals initialized');
      }
    }
    
    if (mergedOptions.debug) {
      logger.info('Performance monitoring initialized successfully');
    }
  } catch (error) {
    logger.error('Failed to initialize performance monitoring:', error);
  }
}

/**
 * Shutdown all performance monitoring utilities
 */
function shutdownPerformanceMonitoring(): void {
  try {
    // Stop performance alerts
    performanceAlerts.stop();
    
    // Stop analytics web vitals
    analyticsWebVitals.stop();
    
    logger.info('Performance monitoring shutdown successfully');
  } catch (error) {
    logger.error('Failed to shutdown performance monitoring:', error);
  }
}

/**
 * Helper function to deeply merge options
 */
function mergeOptions<T>(
  defaults: T,
  overrides: Partial<T> = {}
): T {
  const result = { ...defaults };
  
  for (const key in overrides) {
    if (
      typeof overrides[key] === 'object' &&
      overrides[key] !== null &&
      !Array.isArray(overrides[key]) &&
      typeof defaults[key] === 'object' &&
      defaults[key] !== null
    ) {
      result[key] = mergeOptions(defaults[key], overrides[key]);
    } else if (overrides[key] !== undefined) {
      result[key] = overrides[key];
    }
  }
  
  return result;
}

/**
 * Create a React hook to initialize performance monitoring in a component
 */
function usePerformanceIntegration(
  options: PerformanceIntegrationOptions = {}
): void {
  useEffect(() => {
    // Initialize performance monitoring
    initializePerformanceMonitoring(options);
    
    // Clean up when component unmounts
    return () => {
      shutdownPerformanceMonitoring();
    };
  }, []);
}

// Export main functions
export {
  initializePerformanceMonitoring,
  shutdownPerformanceMonitoring,
  usePerformanceIntegration,
};

// Export types
export type { PerformanceIntegrationOptions };

// Export underlying utilities for direct access if needed
export {
  performanceMonitor,
  webVitalsMonitor,
  performanceAlerts,
  analyticsWebVitals,
}; 