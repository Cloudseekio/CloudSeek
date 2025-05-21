import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

type AnnouncementPolitenessSetting = 'polite' | 'assertive' | 'off';

interface AccessibilityContextType {
  /**
   * Announce a message to screen readers
   */
  announce: (message: string, politeness?: AnnouncementPolitenessSetting) => void;
  
  /**
   * Clear any pending announcements 
   */
  clearAnnouncements: () => void;
  
  /**
   * Set the default politeness level for announcements
   */
  setDefaultPoliteness: (politeness: AnnouncementPolitenessSetting) => void;
  
  /**
   * Set focus to an element - with checks for validity
   */
  setFocus: (element: HTMLElement | null) => boolean;
  
  /**
   * Get the current reduced motion preference
   */
  prefersReducedMotion: boolean;
  
  /**
   * Get the current high contrast preference
   */
  prefersHighContrast: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const AccessibilityProvider: React.FC<{
  children: React.ReactNode;
  defaultPoliteness?: AnnouncementPolitenessSetting;
}> = ({ 
  children, 
  defaultPoliteness = 'polite' 
}) => {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const [defaultPolitenessSetting, setDefaultPoliteness] = useState<AnnouncementPolitenessSetting>(defaultPoliteness);
  
  // Media query states for user preferences
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  
  const [prefersHighContrast, setPrefersHighContrast] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-contrast: more)').matches || 
           window.matchMedia('(-ms-high-contrast: active)').matches;
  });
  
  // Keep track of announcement timeouts for cleanup
  const politeTimeoutRef = useRef<number | null>(null);
  const assertiveTimeoutRef = useRef<number | null>(null);
  
  // Announce a message to screen readers
  const announce = useCallback((message: string, politeness: AnnouncementPolitenessSetting = defaultPolitenessSetting) => {
    if (politeness === 'off') return;
    
    // Clear any existing timeouts
    if (politeTimeoutRef.current) window.clearTimeout(politeTimeoutRef.current);
    if (assertiveTimeoutRef.current) window.clearTimeout(assertiveTimeoutRef.current);
    
    // Set the message based on politeness level
    if (politeness === 'polite') {
      setPoliteMessage(message);
      
      // Clear the message after a few seconds
      politeTimeoutRef.current = window.setTimeout(() => {
        setPoliteMessage('');
        politeTimeoutRef.current = null;
      }, 3000);
    } else {
      setAssertiveMessage(message);
      
      // Clear the assertive message after a few seconds
      assertiveTimeoutRef.current = window.setTimeout(() => {
        setAssertiveMessage('');
        assertiveTimeoutRef.current = null;
      }, 3000);
    }
  }, [defaultPolitenessSetting]);
  
  // Clear all announcements
  const clearAnnouncements = useCallback(() => {
    if (politeTimeoutRef.current) window.clearTimeout(politeTimeoutRef.current);
    if (assertiveTimeoutRef.current) window.clearTimeout(assertiveTimeoutRef.current);
    
    setPoliteMessage('');
    setAssertiveMessage('');
    
    politeTimeoutRef.current = null;
    assertiveTimeoutRef.current = null;
  }, []);
  
  // Safely set focus to an element
  const setFocus = useCallback((element: HTMLElement | null): boolean => {
    if (!element) return false;
    
    try {
      // Check if the element is focusable
      if (element.tabIndex < 0 && 
          !element.hasAttribute('href') && 
          element.tagName !== 'BUTTON' && 
          element.tagName !== 'INPUT' &&
          element.tagName !== 'SELECT' && 
          element.tagName !== 'TEXTAREA') {
        element.tabIndex = -1; // Make it programmatically focusable
      }
      
      element.focus();
      return document.activeElement === element;
    } catch (err) {
      console.error('Failed to set focus:', err);
      return false;
    }
  }, []);
  
  // Set up media query listeners
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: more)');
    const msHighContrastQuery = window.matchMedia('(-ms-high-contrast: active)');
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };
    
    // Add listeners using the appropriate method based on browser support
    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
      highContrastQuery.addEventListener('change', handleHighContrastChange);
      msHighContrastQuery.addEventListener('change', handleHighContrastChange);
    } else {
      // Fallback for older browsers
      reducedMotionQuery.addListener(handleReducedMotionChange);
      highContrastQuery.addListener(handleHighContrastChange);
      msHighContrastQuery.addListener(handleHighContrastChange);
    }
    
    return () => {
      // Clean up listeners
      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
        highContrastQuery.removeEventListener('change', handleHighContrastChange);
        msHighContrastQuery.removeEventListener('change', handleHighContrastChange);
      } else {
        // Fallback for older browsers
        reducedMotionQuery.removeListener(handleReducedMotionChange);
        highContrastQuery.removeListener(handleHighContrastChange);
        msHighContrastQuery.removeListener(handleHighContrastChange);
      }
    };
  }, []);
  
  // Context value
  const contextValue: AccessibilityContextType = {
    announce,
    clearAnnouncements,
    setDefaultPoliteness,
    setFocus,
    prefersReducedMotion,
    prefersHighContrast,
  };
  
  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      
      {/* Hidden elements for screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        {politeMessage}
      </div>
      
      <div 
        aria-live="assertive" 
        aria-atomic="true" 
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        {assertiveMessage}
      </div>
    </AccessibilityContext.Provider>
  );
};

/**
 * Hook to use accessibility context
 */
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}

/**
 * Utility hook for screen reader announcements
 */
export function useAnnounce() {
  const { announce } = useAccessibility();
  return announce;
}

/**
 * Utility hook to check if reduced motion is preferred
 */
export function usePrefersReducedMotion() {
  const { prefersReducedMotion } = useAccessibility();
  return prefersReducedMotion;
}

/**
 * Utility hook to check if high contrast is preferred
 */
export function usePrefersHighContrast() {
  const { prefersHighContrast } = useAccessibility();
  return prefersHighContrast;
} 