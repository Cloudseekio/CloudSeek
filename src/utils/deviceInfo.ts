/**
 * Utility for capturing detailed device and connection information
 * to enhance web vitals and performance metrics
 */

export interface DeviceInfo {
  /**
   * Device type (desktop, mobile, tablet)
   */
  deviceType: string;
  
  /**
   * Operating system
   */
  os: string;
  
  /**
   * Browser name and version
   */
  browser: string;
  
  /**
   * Screen dimensions
   */
  screenSize: {
    width: number;
    height: number;
  };
  
  /**
   * Viewport dimensions
   */
  viewport: {
    width: number;
    height: number;
  };
  
  /**
   * Device pixel ratio
   */
  devicePixelRatio: number;
  
  /**
   * Whether the device is touch enabled
   */
  touchEnabled: boolean;
  
  /**
   * Memory info if available
   */
  memory?: {
    jsHeapSizeLimit?: number;
    totalJSHeapSize?: number;
    usedJSHeapSize?: number;
  };
}

export interface ConnectionInfo {
  /**
   * Connection type (4g, 3g, 2g, wifi, etc.)
   */
  type: string;
  
  /**
   * Effective connection type based on actual performance
   */
  effectiveType: string;
  
  /**
   * Downlink speed in Mbps
   */
  downlinkMbps: number;
  
  /**
   * Round-trip time in milliseconds
   */
  rtt: number;
  
  /**
   * Whether the user has enabled data saver
   */
  saveData: boolean;
}

/**
 * Get detailed device information
 */
export function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent;
  
  // Detect device type
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /(iPad|tablet|Nexus 7)/i.test(ua) || 
    (isMobile && Math.min(window.screen.width, window.screen.height) > 640);
  
  let deviceType = 'desktop';
  if (isTablet) deviceType = 'tablet';
  else if (isMobile) deviceType = 'mobile';
  
  // Detect OS
  let os = 'unknown';
  if (/(win)/i.test(ua)) {
    os = 'Windows';
  } else if (/(mac)/i.test(ua)) {
    os = 'Mac';
  } else if (/(linux)/i.test(ua)) {
    os = 'Linux';
  } else if (/(android)/i.test(ua)) {
    os = 'Android';
  } else if (/(iphone|ipad|ipod)/i.test(ua)) {
    os = 'iOS';
  }
  
  // Detect browser
  let browser = 'unknown';
  if (/edge|edg/i.test(ua)) {
    browser = 'Edge';
  } else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) {
    browser = 'Chrome';
  } else if (/firefox/i.test(ua)) {
    browser = 'Firefox';
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browser = 'Safari';
  } else if (/msie|trident/i.test(ua)) {
    browser = 'Internet Explorer';
  }
  
  // Get memory info if available
  const memory = (performance as any).memory ? {
    jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
    totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
    usedJSHeapSize: (performance as any).memory.usedJSHeapSize
  } : undefined;
  
  return {
    deviceType,
    os,
    browser,
    screenSize: {
      width: window.screen.width,
      height: window.screen.height
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    devicePixelRatio: window.devicePixelRatio || 1,
    touchEnabled: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    memory
  };
}

/**
 * Get detailed connection information
 */
export function getConnectionInfo(): ConnectionInfo {
  // Default values if Network Information API is not available
  const defaultInfo: ConnectionInfo = {
    type: 'unknown',
    effectiveType: 'unknown',
    downlinkMbps: 0,
    rtt: 0,
    saveData: false
  };
  
  // Check if Network Information API is available
  const connection = (navigator as any).connection;
  if (!connection) {
    return defaultInfo;
  }
  
  return {
    type: connection.type || 'unknown',
    effectiveType: connection.effectiveType || 'unknown',
    downlinkMbps: connection.downlink || 0,
    rtt: connection.rtt || 0,
    saveData: connection.saveData || false
  };
}

/**
 * Get combined device and connection information
 */
export function getEnhancedContextInfo(): Record<string, any> {
  return {
    device: getDeviceInfo(),
    connection: getConnectionInfo(),
    url: window.location.href,
    pathname: window.location.pathname,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };
}

/**
 * Get core device and connection information as simple key-value pairs
 * This format is more suitable for sending to analytics services
 */
export function getSimplifiedContextInfo(): Record<string, string | number | boolean> {
  const device = getDeviceInfo();
  const connection = getConnectionInfo();
  
  return {
    device_type: device.deviceType,
    os: device.os,
    browser: device.browser,
    screen_width: device.screenSize.width,
    screen_height: device.screenSize.height,
    viewport_width: device.viewport.width,
    viewport_height: device.viewport.height,
    pixel_ratio: device.devicePixelRatio,
    touch_enabled: device.touchEnabled,
    connection_type: connection.type,
    effective_connection: connection.effectiveType,
    downlink_mbps: connection.downlinkMbps,
    rtt_ms: connection.rtt,
    save_data: connection.saveData,
    url: window.location.href,
    pathname: window.location.pathname
  };
} 