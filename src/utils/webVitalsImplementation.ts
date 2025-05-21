/**
 * Implementation of Core Web Vitals metrics
 * 
 * This file provides implementations of the Core Web Vitals metrics
 * for browsers that don't support the web-vitals API or when the package
 * is not available.
 */

// Define the Metric interface that matches web-vitals package
export interface Metric {
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string | null;
  entries: PerformanceEntry[];
}

// Specific metric types
export interface CLSMetric extends Metric {
  name: 'CLS';
  value: number;
}

export interface FCPMetric extends Metric {
  name: 'FCP';
  value: number;
}

export interface FIDMetric extends Metric {
  name: 'FID';
  value: number;
}

export interface INPMetric extends Metric {
  name: 'INP';
  value: number;
}

export interface LCPMetric extends Metric {
  name: 'LCP';
  value: number;
}

export interface TTFBMetric extends Metric {
  name: 'TTFB';
  value: number;
}

export type ReportCallback = (metric: Metric) => void;

// Implementation of Core Web Vitals measurement functions
export function onCLS(callback: ReportCallback): void {
  if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let clsValue = 0;
        
        entries.forEach(entry => {
          // Only count layout shifts without user input
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        
        callback({
          name: 'CLS',
          value: clsValue,
          rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
          delta: clsValue,
          id: generateUniqueID(),
          navigationType: (self.performance as any)?.getEntriesByType?.('navigation')[0]?.type ?? null,
          entries: entries
        });
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('Failed to observe CLS:', e);
    }
  } else {
    console.warn('CLS measurement not supported in this browser');
  }
}

export function onFCP(callback: ReportCallback): void {
  if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('paint')) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            observer.disconnect();
            
            const value = entry.startTime;
            callback({
              name: 'FCP',
              value,
              rating: value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor',
              delta: value,
              id: generateUniqueID(),
              navigationType: (self.performance as any)?.getEntriesByType?.('navigation')[0]?.type ?? null,
              entries: [entry]
            });
            break;
          }
        }
      });
      
      observer.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.error('Failed to observe FCP:', e);
    }
  } else {
    console.warn('FCP measurement not supported in this browser');
  }
}

export function onFID(callback: ReportCallback): void {
  if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('first-input')) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const entry = entries[0];
          observer.disconnect();
          
          const value = (entry as PerformanceEventTiming).processingStart - entry.startTime;
          callback({
            name: 'FID',
            value,
            rating: value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor',
            delta: value,
            id: generateUniqueID(),
            navigationType: (self.performance as any)?.getEntriesByType?.('navigation')[0]?.type ?? null,
            entries: [entry]
          });
        }
      });
      
      observer.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('Failed to observe FID:', e);
    }
  } else {
    console.warn('FID measurement not supported in this browser');
  }
}

export function onINP(callback: ReportCallback): void {
  if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('event')) {
    try {
      let maxINP = 0;
      let maxINPEntry: PerformanceEntry | null = null;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach(entry => {
          if ((entry as any).interactionId && entry.duration > maxINP) {
            maxINP = entry.duration;
            maxINPEntry = entry;
          }
        });
        
        if (maxINPEntry) {
          callback({
            name: 'INP',
            value: maxINP,
            rating: maxINP <= 200 ? 'good' : maxINP <= 500 ? 'needs-improvement' : 'poor',
            delta: maxINP,
            id: generateUniqueID(),
            navigationType: (self.performance as any)?.getEntriesByType?.('navigation')[0]?.type ?? null,
            entries: [maxINPEntry]
          });
        }
      });
      
      observer.observe({ type: 'event', durationThreshold: 16, buffered: true });
      
      // Report the metric after the page has been unloaded
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && maxINPEntry) {
          observer.disconnect();
        }
      });
    } catch (e) {
      console.error('Failed to observe INP:', e);
    }
  } else {
    console.warn('INP measurement not supported in this browser');
  }
}

export function onLCP(callback: ReportCallback): void {
  if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
    try {
      let lcpEntry: PerformanceEntry | null = null;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        lcpEntry = entries[entries.length - 1];
      });
      
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      
      // Report the metric after the page has been unloaded
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && lcpEntry) {
          observer.disconnect();
          
          const value = lcpEntry.startTime;
          callback({
            name: 'LCP',
            value,
            rating: value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor',
            delta: value,
            id: generateUniqueID(),
            navigationType: (self.performance as any)?.getEntriesByType?.('navigation')[0]?.type ?? null,
            entries: [lcpEntry]
          });
        }
      });
    } catch (e) {
      console.error('Failed to observe LCP:', e);
    }
  } else {
    console.warn('LCP measurement not supported in this browser');
  }
}

export function onTTFB(callback: ReportCallback): void {
  try {
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const value = navigationEntries[0].responseStart;
      callback({
        name: 'TTFB',
        value,
        rating: value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor',
        delta: value,
        id: generateUniqueID(),
        navigationType: (self.performance as any)?.getEntriesByType?.('navigation')[0]?.type ?? null,
        entries: navigationEntries
      });
    }
  } catch (e) {
    console.error('Failed to measure TTFB:', e);
  }
}

// Helper function to generate a unique ID for metrics
function generateUniqueID(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

// Bundle all functions for default export
const webVitals = {
  onCLS,
  onFID,
  onLCP,
  onFCP,
  onTTFB,
  onINP
};

export default webVitals; 