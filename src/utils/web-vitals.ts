/**
 * Web vitals exports
 * 
 * This file provides a consistent interface matching the web-vitals package API
 * but using our internal implementation in webVitalsImplementation.ts.
 * This allows us to function without requiring the external web-vitals package.
 */

// Re-export everything from our custom implementation
export {
  onCLS,
  onFID,
  onLCP,
  onFCP,
  onTTFB,
  onINP,
  type Metric,
  type ReportCallback,
  type CLSMetric,
  type FCPMetric,
  type FIDMetric,
  type INPMetric,
  type LCPMetric,
  type TTFBMetric,
} from './webVitalsImplementation';

// Default export for legacy imports
import webVitals from './webVitalsImplementation';
export default webVitals;