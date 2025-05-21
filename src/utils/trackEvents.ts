/**
 * Event tracking utility for common user interactions
 * 
 * This file provides predefined functions for tracking common user interactions,
 * making it easier to consistently track events across the application.
 */

import { trackEvent } from './analytics';
import { EventCategories, EventActions } from './analyticsConfig';

/**
 * Track form submission
 */
export const trackFormSubmission = (
  formId: string,
  success: boolean,
  params?: Record<string, any>
): void => {
  trackEvent(
    success ? 'form_submission_success' : 'form_submission_failure',
    EventCategories.FORM,
    EventActions.SUBMIT,
    {
      form_id: formId,
      ...params
    }
  );
};

/**
 * Track form error
 */
export const trackFormError = (
  formId: string,
  fieldName: string,
  errorMessage: string,
  params?: Record<string, any>
): void => {
  trackEvent(
    'form_error',
    EventCategories.FORM,
    EventActions.ERROR,
    {
      form_id: formId,
      field_name: fieldName,
      error_message: errorMessage,
      ...params
    }
  );
};

/**
 * Track button click
 */
export const trackButtonClick = (
  buttonId: string,
  buttonText?: string,
  params?: Record<string, any>
): void => {
  trackEvent(
    'button_click',
    EventCategories.ENGAGEMENT,
    EventActions.CLICK,
    {
      button_id: buttonId,
      button_text: buttonText,
      ...params
    }
  );
};

/**
 * Track link click
 */
export const trackLinkClick = (
  linkUrl: string,
  linkText?: string,
  isExternal?: boolean,
  params?: Record<string, any>
): void => {
  trackEvent(
    'link_click',
    EventCategories.NAVIGATION,
    EventActions.CLICK,
    {
      link_url: linkUrl,
      link_text: linkText,
      is_external: isExternal,
      ...params
    }
  );
};

/**
 * Track file download
 */
export const trackFileDownload = (
  fileUrl: string,
  fileName: string,
  fileType: string,
  fileSize?: number,
  params?: Record<string, any>
): void => {
  trackEvent(
    'file_download',
    EventCategories.DOWNLOAD,
    EventActions.DOWNLOAD,
    {
      file_url: fileUrl,
      file_name: fileName,
      file_type: fileType,
      file_size: fileSize,
      ...params
    }
  );
};

/**
 * Track search
 */
export const trackSearch = (
  searchTerm: string,
  resultsCount: number,
  params?: Record<string, any>
): void => {
  trackEvent(
    'search',
    EventCategories.SEARCH,
    EventActions.SEARCH,
    {
      search_term: searchTerm,
      results_count: resultsCount,
      ...params
    }
  );
};

/**
 * Track modal open
 */
export const trackModalOpen = (
  modalName: string,
  params?: Record<string, any>
): void => {
  trackEvent(
    'modal_open',
    EventCategories.ENGAGEMENT,
    EventActions.VIEW,
    {
      modal_name: modalName,
      ...params
    }
  );
};

/**
 * Track modal close
 */
export const trackModalClose = (
  modalName: string,
  params?: Record<string, any>
): void => {
  trackEvent(
    'modal_close',
    EventCategories.ENGAGEMENT,
    EventActions.CLICK,
    {
      modal_name: modalName,
      ...params
    }
  );
};

/**
 * Track content engagement
 */
export const trackContentEngagement = (
  contentType: string,
  contentId: string,
  contentName: string,
  engagementType: 'view' | 'scroll' | 'click' | 'share',
  params?: Record<string, any>
): void => {
  const actionMap = {
    view: EventActions.VIEW,
    scroll: EventActions.SCROLL,
    click: EventActions.CLICK,
    share: EventActions.SHARE
  };

  trackEvent(
    `content_${engagementType}`,
    EventCategories.CONTENT,
    actionMap[engagementType],
    {
      content_type: contentType,
      content_id: contentId,
      content_name: contentName,
      ...params
    }
  );
};

/**
 * Track authentication event
 */
export const trackAuthentication = (
  eventType: 'login' | 'logout' | 'signup',
  method: string,
  success: boolean,
  params?: Record<string, any>
): void => {
  const actionMap = {
    login: EventActions.LOGIN,
    logout: EventActions.LOGOUT,
    signup: EventActions.SIGNUP
  };

  trackEvent(
    `auth_${eventType}${success ? '_success' : '_failure'}`,
    EventCategories.AUTHENTICATION,
    actionMap[eventType],
    {
      auth_method: method,
      success,
      ...params
    }
  );
};

/**
 * Track filter or sort
 */
export const trackFilter = (
  filterName: string,
  filterValue: string,
  params?: Record<string, any>
): void => {
  trackEvent(
    'filter_use',
    EventCategories.SEARCH,
    EventActions.FILTER,
    {
      filter_name: filterName,
      filter_value: filterValue,
      ...params
    }
  );
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (
  depth: number,
  pageUrl?: string,
  params?: Record<string, any>
): void => {
  trackEvent(
    'scroll_depth',
    EventCategories.ENGAGEMENT,
    EventActions.SCROLL,
    {
      scroll_depth: depth,
      page_url: pageUrl || window.location.href,
      ...params
    }
  );
};

/**
 * Track error
 */
export const trackError = (
  errorType: string,
  errorMessage: string,
  stackTrace?: string,
  params?: Record<string, any>
): void => {
  trackEvent(
    'app_error',
    EventCategories.ERROR,
    EventActions.ERROR,
    {
      error_type: errorType,
      error_message: errorMessage,
      stack_trace: stackTrace,
      ...params
    }
  );
};

/**
 * Track feature usage
 */
export const trackFeatureUsage = (
  featureName: string,
  params?: Record<string, any>
): void => {
  trackEvent(
    'feature_use',
    EventCategories.ENGAGEMENT,
    EventActions.CLICK,
    {
      feature_name: featureName,
      ...params
    }
  );
};

// Export all tracking functions
export default {
  trackFormSubmission,
  trackFormError,
  trackButtonClick,
  trackLinkClick,
  trackFileDownload,
  trackSearch,
  trackModalOpen,
  trackModalClose,
  trackContentEngagement,
  trackAuthentication,
  trackFilter,
  trackScrollDepth,
  trackError,
  trackFeatureUsage
}; 