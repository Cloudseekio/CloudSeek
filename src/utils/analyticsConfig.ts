/**
 * Google Analytics 4 Configuration
 */

// Consent types as string literals to avoid enum initialization issues
export type ConsentType = 
  | 'analytics_storage'
  | 'ad_storage'
  | 'functionality_storage'
  | 'personalization_storage'
  | 'security_storage';

// Event categories as string literals
export type EventCategory = 
  | 'engagement'
  | 'form'
  | 'navigation'
  | 'search'
  | 'content'
  | 'ecommerce'
  | 'error'
  | 'authentication'
  | 'download'
  | 'share';

// Event actions as string literals
export type EventAction = 
  | 'click'
  | 'view'
  | 'submit'
  | 'start'
  | 'complete'
  | 'error'
  | 'download'
  | 'login'
  | 'logout'
  | 'signup'
  | 'search'
  | 'filter'
  | 'sort'
  | 'share'
  | 'scroll';

// Constant objects for EventCategory and EventAction for easier access
export const EventCategories: Record<string, EventCategory> = {
  ENGAGEMENT: 'engagement',
  FORM: 'form',
  NAVIGATION: 'navigation',
  SEARCH: 'search',
  CONTENT: 'content',
  ECOMMERCE: 'ecommerce',
  ERROR: 'error',
  AUTHENTICATION: 'authentication',
  DOWNLOAD: 'download',
  SHARE: 'share'
};

export const EventActions: Record<string, EventAction> = {
  CLICK: 'click',
  VIEW: 'view',
  SUBMIT: 'submit',
  START: 'start',
  COMPLETE: 'complete',
  ERROR: 'error',
  DOWNLOAD: 'download',
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGNUP: 'signup',
  SEARCH: 'search',
  FILTER: 'filter',
  SORT: 'sort',
  SHARE: 'share',
  SCROLL: 'scroll'
};

// Custom dimensions for user properties
export interface CustomDimensions {
  userRole: string;
  loginStatus: string;
  deviceType: string;
  pageCategory: string;
  contentLanguage: string;
}

// Cross-domain tracking configuration
export interface CrossDomainMeasurement {
  domains: string[];
  acceptIncoming: boolean;
}

// Main configuration interface
export interface AnalyticsConfig {
  // GA4 Measurement ID (replace with your actual ID)
  measurementId: string;
  
  // Cookie domain setting (defaults to auto)
  cookieDomain: string;
  
  // Debug mode (logs to console)
  debug: boolean;
  
  // Default consent settings
  defaultConsent: {
    [key in ConsentType]?: 'granted' | 'denied';
  };
  
  // Custom dimensions
  customDimensions: CustomDimensions;
  
  // Cross-domain tracking
  crossDomainMeasurement?: CrossDomainMeasurement;
  
  // Paths to exclude from tracking
  excludePaths: string[];
}

// Create and export the configuration
const analyticsConfig: AnalyticsConfig = {
  measurementId: 'G-8H4P0JWKL1', // Your GA4 Measurement ID
  cookieDomain: 'auto',
  debug: true, // Enable for development, disable for production
  
  // Default consent settings (denied by default for GDPR compliance)
  defaultConsent: {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'functionality_storage': 'granted', // Usually needed for basic functionality
    'personalization_storage': 'denied',
    'security_storage': 'granted' // Security is usually needed
  },
  
  // Custom dimensions
  customDimensions: {
    userRole: 'user_role',
    loginStatus: 'login_status',
    deviceType: 'device_type',
    pageCategory: 'page_category',
    contentLanguage: 'content_language'
  },
  
  // Cross-domain measurement configuration
  crossDomainMeasurement: {
    domains: ['example.com', 'shop.example.com'],
    acceptIncoming: true
  },
  
  // Paths to exclude from tracking (privacy pages, admin, etc.)
  excludePaths: [
    '/privacy',
    '/terms',
    '/admin',
    '/debug',
    '/offline'
  ]
};

export default analyticsConfig; 