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

interface CookieConsentSectionProps {
  className?: string;
}

/**
 * Cookie Consent Section for Privacy Policy page
 */
const CookieConsentSection: React.FC<CookieConsentSectionProps> = ({ className = '' }) => {
  // State for consent settings
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>(DEFAULT_CONSENT);
  
  // State for showing detailed descriptions
  const [showDetails, setShowDetails] = useState(false);

  // Load saved consent preferences on mount
  useEffect(() => {
    const loadSavedConsent = () => {
      try {
        const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
        if (savedConsent) {
          const parsedConsent = JSON.parse(savedConsent) as ConsentSettings;
          setConsentSettings(parsedConsent);
          return true;
        }
      } catch (error) {
        console.error('Error loading consent preferences:', error);
      }
      return false;
    };

    loadSavedConsent();
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
      
      // Show success message
      alert('Your cookie preferences have been saved.');
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
      
      // Show success message
      alert('All cookies have been accepted.');
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
      
      // Show success message
      alert('All non-essential cookies have been rejected.');
    } catch (error) {
      console.error('Error saving consent preferences:', error);
    }
  };

  // Function to toggle details view
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className={`mt-8 mb-12 ${className}`}>
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie Settings</h2>
        <p className="text-gray-600 mb-6">
          We use cookies to improve your experience on our website. You can choose which types of cookies you allow us to use. By default, only essential cookies that are necessary for the website to function properly are enabled.
        </p>

        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Cookie Preferences</h3>
          <button 
            onClick={toggleDetails}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showDetails ? 'Hide details' : 'Show details'}
          </button>
        </div>
        
        <div className="mb-8 space-y-4">
          {Object.entries(CONSENT_DESCRIPTIONS).map(([key, { title, description }]) => (
            <div key={key} className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex-grow">
                <div className="flex items-center">
                  <span className="text-base font-medium text-gray-800">{title}</span>
                  {(key === 'functionality_storage' || key === 'security_storage') && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Required</span>
                  )}
                </div>
                {showDetails && (
                  <p className="text-sm text-gray-600 mt-1 pr-4">{description}</p>
                )}
              </div>
              <div className="ml-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentSettings[key as keyof ConsentSettings] === 'granted'}
                    onChange={() => handleConsentToggle(key as keyof ConsentSettings)}
                    disabled={key === 'functionality_storage' || key === 'security_storage'}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full peer ${
                    key === 'functionality_storage' || key === 'security_storage'
                      ? 'bg-blue-600'
                      : consentSettings[key as keyof ConsentSettings] === 'granted'
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                  } peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4 justify-end">
          <button
            onClick={handleRejectAll}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Reject All
          </button>
          <button
            onClick={handleSaveConsent}
            className="px-4 py-2 border border-transparent rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
          >
            Save Preferences
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentSection; 