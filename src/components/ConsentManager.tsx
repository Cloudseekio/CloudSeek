import React, { useEffect, useState } from 'react';
import { ConsentSettings, updateConsentSettings } from '../utils/analytics';

// Default consent settings
const DEFAULT_CONSENT: ConsentSettings = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  functionality_storage: 'granted',
  personalization_storage: 'denied',
  security_storage: 'granted'
};

// Consent descriptions for user-friendly labels
const CONSENT_DESCRIPTIONS = {
  analytics_storage: {
    title: 'Analytics',
    description: 'Allow us to collect information about how you use our website to improve your experience.'
  },
  ad_storage: {
    title: 'Advertisement',
    description: 'Allow us to use information for advertisement personalization.'
  },
  functionality_storage: {
    title: 'Functionality',
    description: 'Essential cookies that help make the website usable by enabling basic functions.'
  },
  personalization_storage: {
    title: 'Personalization',
    description: 'Allow us to remember information that changes the way the website behaves or looks.'
  },
  security_storage: {
    title: 'Security',
    description: 'Cookies that help identify and prevent security risks.'
  }
};

// Local storage key for saving consent
const CONSENT_STORAGE_KEY = 'cloudseek_consent_preferences';

interface ConsentManagerProps {
  /** Container className */
  className?: string;
  /** Whether to show the panel by default if consent hasn't been provided */
  autoShow?: boolean;
  /** Callback for when consent is updated */
  onConsentUpdate?: (settings: ConsentSettings) => void;
}

/**
 * Consent Manager Component for handling GA4 consent settings
 */
const ConsentManager: React.FC<ConsentManagerProps> = ({
  className = '',
  autoShow = true,
  onConsentUpdate
}) => {
  // State for consent settings
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>(DEFAULT_CONSENT);
  
  // State for showing the consent panel
  const [showConsentPanel, setShowConsentPanel] = useState(false);
  
  // State for showing detailed descriptions (true for expanded view, false for compact)
  const [showDetails, setShowDetails] = useState(false);

  // Load saved consent preferences on mount
  useEffect(() => {
    const loadSavedConsent = () => {
      try {
        const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (savedConsent) {
          const parsedConsent = JSON.parse(savedConsent) as ConsentSettings;
          setConsentSettings(parsedConsent);
          
          // Update analytics with the saved consent
          updateConsentSettings(parsedConsent);
          
          // Callback
          onConsentUpdate?.(parsedConsent);
          
          return true;
        }
      } catch (error) {
        console.error('Error loading consent preferences:', error);
      }
      return false;
    };

    const hasConsent = loadSavedConsent();
    
    // Show the panel if no consent has been given and autoShow is true
    if (!hasConsent && autoShow) {
      setShowConsentPanel(true);
    }
  }, [autoShow, onConsentUpdate]);

  // Listen for the custom event to open cookie settings
  useEffect(() => {
    const handleOpenCookieSettings = () => {
      openConsentPanel();
    };

    window.addEventListener('openCookieSettings', handleOpenCookieSettings);
    
    return () => {
      window.removeEventListener('openCookieSettings', handleOpenCookieSettings);
    };
  }, []);

  // Handle toggling individual consent options
  const handleConsentToggle = (key: keyof ConsentSettings) => {
    setConsentSettings(prevSettings => {
      const newSettings = { 
        ...prevSettings,
        [key]: prevSettings[key] === 'granted' ? 'denied' : 'granted' 
      };
      return newSettings;
    });
  };

  // Handle saving all consent preferences
  const handleSaveConsent = () => {
    try {
      // Save to local storage
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentSettings));
      
      // Update analytics
      updateConsentSettings(consentSettings);
      
      // Callback
      onConsentUpdate?.(consentSettings);
      
      // Hide the panel
      setShowConsentPanel(false);
    } catch (error) {
      console.error('Error saving consent preferences:', error);
    }
  };

  // Accept all cookies
  const handleAcceptAll = () => {
    const allGrantedSettings: ConsentSettings = Object.keys(consentSettings).reduce(
      (acc, key) => ({ ...acc, [key]: 'granted' }),
      {} as ConsentSettings
    );
    
    setConsentSettings(allGrantedSettings);
    
    try {
      // Save to local storage
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(allGrantedSettings));
      
      // Update analytics
      updateConsentSettings(allGrantedSettings);
      
      // Callback
      onConsentUpdate?.(allGrantedSettings);
      
      // Hide the panel
      setShowConsentPanel(false);
    } catch (error) {
      console.error('Error saving consent preferences:', error);
    }
  };

  // Reject all except essential
  const handleRejectAll = () => {
    const minimalSettings: ConsentSettings = {
      ...DEFAULT_CONSENT,
      functionality_storage: 'granted',
      security_storage: 'granted'
    };
    
    setConsentSettings(minimalSettings);
    
    try {
      // Save to local storage
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(minimalSettings));
      
      // Update analytics
      updateConsentSettings(minimalSettings);
      
      // Callback
      onConsentUpdate?.(minimalSettings);
      
      // Hide the panel
      setShowConsentPanel(false);
    } catch (error) {
      console.error('Error saving consent preferences:', error);
    }
  };

  // Function to show the consent panel
  const openConsentPanel = () => {
    setShowConsentPanel(true);
  };

  // Function to toggle details view
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!showConsentPanel) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}>
      <div className="bg-white shadow-lg border-t border-gray-200 max-w-6xl mx-auto">
        <div className="p-3 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-shrink-0">
              <h2 className="text-sm font-medium text-gray-900">Cookie Settings</h2>
              <p className="text-xs text-gray-600 max-w-xs">
                We use cookies to improve your experience. Choose your preferences below.
              </p>
              <button 
                onClick={toggleDetails}
                className="text-[10px] text-blue-600 hover:text-blue-800 font-medium mt-1"
              >
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
            </div>
            
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-1 mx-0 sm:mx-4">
              {Object.entries(CONSENT_DESCRIPTIONS).map(([key, { title, description }]) => (
                <div key={key} className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentSettings[key as keyof ConsentSettings] === 'granted'}
                        onChange={() => handleConsentToggle(key as keyof ConsentSettings)}
                        disabled={key === 'functionality_storage' || key === 'security_storage'}
                        className="sr-only peer"
                      />
                      <div className={`w-7 h-4 rounded-full peer ${
                        key === 'functionality_storage' || key === 'security_storage'
                          ? 'bg-blue-600'
                          : consentSettings[key as keyof ConsentSettings] === 'granted'
                            ? 'bg-blue-600'
                            : 'bg-gray-300'
                      } peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all`}></div>
                    </label>
                    <div>
                      <span className="text-xs font-medium text-gray-800">{title}</span>
                      {(key === 'functionality_storage' || key === 'security_storage') && (
                        <span className="ml-1 px-1 py-0.5 text-[9px] bg-blue-100 text-blue-800 rounded">Required</span>
                      )}
                      {showDetails && (
                        <p className="text-[9px] text-gray-500 mt-0.5 pr-2">{description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex-shrink-0 flex gap-2 items-center">
              <button
                onClick={handleRejectAll}
                className="px-2 py-1 text-[10px] border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                Reject All
              </button>
              <button
                onClick={handleSaveConsent}
                className="px-2 py-1 text-[10px] border border-transparent rounded text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                Save
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-2 py-1 text-[10px] border border-transparent rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                Accept All
              </button>
              <button 
                onClick={() => setShowConsentPanel(false)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentManager; 