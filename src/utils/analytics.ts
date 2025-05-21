/**
 * Google Analytics 4 Integration Utility
 * 
 * This utility provides a comprehensive interface for interacting with Google Analytics 4,
 * including initialization, page view tracking, event tracking, consent management,
 * custom dimensions, and cross-domain tracking.
 */

import { AnalyticsConfig, ConsentType, EventCategory, EventAction, CustomDimensions } from './analyticsConfig';

// Re-export the ConsentType for use in ConsentManager
export type ConsentSettings = {
  [key in ConsentType]: 'granted' | 'denied';
};

// Declare global window interface with gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Check if Analytics is available in the window
 */
function isAnalyticsAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag !== 'undefined';
}

/**
 * Get consent status
 */
function getConsentStatus(type: ConsentType): 'granted' | 'denied' {
  try {
    if (!isAnalyticsAvailable()) return 'denied';
    
    const consentCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('gdpr_consent='));
    
    if (consentCookie) {
      const consentData = JSON.parse(decodeURIComponent(consentCookie.split('=')[1]));
      return consentData[type] || 'denied';
    }
    
    return 'denied';
  } catch (error) {
    console.error('Error getting consent status:', error);
    return 'denied';
  }
}

/**
 * Update consent for a specific type
 */
function updateConsent(type: ConsentType, value: 'granted' | 'denied'): void {
  try {
    if (!isAnalyticsAvailable()) return;
    
    window.gtag('consent', 'update', {
      [type]: value
    });
  } catch (error) {
    console.error('Error updating consent:', error);
  }
}

/**
 * Update consent with complete settings object
 */
function updateConsentSettings(settings: ConsentSettings): void {
  try {
    if (!isAnalyticsAvailable()) return;
    
    window.gtag('consent', 'update', settings);
  } catch (error) {
    console.error('Error updating consent settings:', error);
  }
}

/**
 * Initialize Google Analytics
 */
function initializeAnalytics(config: AnalyticsConfig): void {
  try {
    if (!isAnalyticsAvailable()) {
      console.warn('Google Analytics not available');
      return;
    }
    
    // Initialize default consent
    window.gtag('consent', 'default', config.defaultConsent);
    
    // Initialize the GA4 config
    window.gtag('config', config.measurementId, {
      cookie_domain: config.cookieDomain,
      send_page_view: false // We'll handle page views manually
    });
    
    // Set cross-domain measurement if applicable
    if (config.crossDomainMeasurement && config.crossDomainMeasurement.domains.length > 0) {
      window.gtag('config', config.measurementId, {
        linker: {
          domains: config.crossDomainMeasurement.domains,
          accept_incoming: config.crossDomainMeasurement.acceptIncoming
        }
      });
    }
    
    console.log('Google Analytics initialized with config:', config);
  } catch (error) {
    console.error('Error initializing analytics:', error);
  }
}

/**
 * Track a page view
 */
function trackPageView(
  path: string,
  title: string,
  additionalParams?: Record<string, any>
): void {
  try {
    if (!isAnalyticsAvailable()) return;
    
    window.gtag('event', 'page_view', {
      page_title: title,
      page_path: path,
      ...additionalParams
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track an event
 */
function trackEvent(
  eventName: string,
  category: EventCategory,
  action: EventAction,
  params?: Record<string, any>
): void {
  try {
    if (!isAnalyticsAvailable()) return;
    
    window.gtag('event', eventName, {
      event_category: category,
      event_action: action,
      ...params
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

/**
 * Track exception
 */
function trackException(description: string, fatal = false): void {
  try {
    if (!isAnalyticsAvailable()) return;
    
    window.gtag('event', 'exception', {
      description,
      fatal
    });
  } catch (error) {
    console.error('Error tracking exception:', error);
  }
}

/**
 * Set user property
 */
function setUserProperty(name: keyof CustomDimensions, value: string): void {
  try {
    if (!isAnalyticsAvailable()) return;
    
    window.gtag('set', 'user_properties', {
      [name]: value
    });
  } catch (error) {
    console.error('Error setting user property:', error);
  }
}

// Create analytics object with all methods
const analytics = {
  isAnalyticsAvailable,
  getConsentStatus,
  updateConsent,
  updateConsentSettings,
  initializeAnalytics,
  trackPageView,
  trackEvent,
  trackException,
  setUserProperty
};

// Export individual functions for direct imports
export {
  isAnalyticsAvailable,
  getConsentStatus,
  updateConsent,
  updateConsentSettings,
  initializeAnalytics,
  trackPageView,
  trackEvent,
  trackException,
  setUserProperty
};

// Export default object
export default analytics; 