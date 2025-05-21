import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType, NavigationType } from 'react-router-dom';
import { initializeAnalytics, trackPageView } from '../utils/analytics';
import analyticsConfig from '../utils/analyticsConfig';

interface UseAnalyticsOptions {
  /** Enable debug logging */
  debug?: boolean;
  /** Paths to exclude from tracking */
  excludePaths?: string[];
  /** Additional parameters to include with page views */
  globalParams?: Record<string, any>;
}

/**
 * Hook to automatically track page views with React Router
 * 
 * Usage:
 * ```
 * // In your App component or a layout wrapper
 * useAnalytics({
 *   debug: process.env.NODE_ENV === 'development',
 *   excludePaths: ['/debug', '/admin']
 * });
 * ```
 */
const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  
  const { 
    debug = analyticsConfig.debug, 
    excludePaths = analyticsConfig.excludePaths,
    globalParams = {}
  } = options;
  
  // Keep track of the previous path to avoid duplicate page views
  const previousPathRef = useRef<string>('');
  
  useEffect(() => {
    // Initialize analytics when the hook is first mounted
    initializeAnalytics(analyticsConfig);
    
    if (debug) {
      console.log('Analytics initialized with options:', options);
    }
  }, [debug, options]);
  
  useEffect(() => {
    const { pathname, search } = location;
    const currentPath = pathname + search;
    
    // Don't track if the path is in the exclude list
    const shouldExclude = excludePaths.some(path => 
      pathname === path || pathname.startsWith(`${path}/`)
    );
    
    if (shouldExclude) {
      if (debug) {
        console.log('Page view not tracked (excluded path):', currentPath);
      }
      return;
    }
    
    // Don't track if it's the same URL (unless it's a reload)
    const isSamePath = previousPathRef.current === currentPath;
    const isReload = navigationType === NavigationType.Reload;
    
    if (isSamePath && !isReload) {
      if (debug) {
        console.log('Page view not tracked (same path):', currentPath);
      }
      return;
    }
    
    // Track page view
    trackPageView(
      currentPath,
      document.title,
      {
        ...globalParams,
        navigation_type: navigationType
      }
    );
    
    // Update previous path
    previousPathRef.current = currentPath;
  }, [location, navigationType, excludePaths, debug, globalParams]);
  
  // Return empty object since we're no longer returning the analytics object
  return {};
};

export default useAnalytics; 