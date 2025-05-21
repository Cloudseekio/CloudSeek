import * as React from 'react';
const { useState, useEffect } = React;
import { UsePWAReturn } from './usePWA';

// Default return value when PWA hook fails
const defaultPWAValues: UsePWAReturn = {
  isOnline: true, // Assume online by default
  canInstall: false,
  isStandalone: false,
  installApp: async () => {
    console.warn('Install app function not available');
  },
  deferredPrompt: null
};

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && !!window.navigator;

/**
 * A safe alternative to usePWA hook that handles errors and works in non-browser environments
 */
export function useSafePWA(): UsePWAReturn {
  // Setup state with defaults
  const [isOnline, setIsOnline] = useState<boolean>(isBrowser ? navigator.onLine : true);
  const [canInstall, setCanInstall] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(
    isBrowser && window.matchMedia ? 
      window.matchMedia('(display-mode: standalone)').matches : 
      false
  );

  useEffect(() => {
    // Skip effect in non-browser environments
    if (!isBrowser) return;

    try {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setCanInstall(true);
      };
      const handleAppInstalled = () => {
        setCanInstall(false);
        setDeferredPrompt(null);
      };
      const handleDisplayModeChange = (e: MediaQueryListEvent) => {
        setIsStandalone(e.matches);
      };

      // Add event listeners
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      
      const mediaQuery = window.matchMedia('(display-mode: standalone)');
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleDisplayModeChange);
      } else if (mediaQuery.addListener) {
        // Fallback for older browsers
        mediaQuery.addListener(handleDisplayModeChange);
      }

      // Cleanup
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleDisplayModeChange);
        } else if (mediaQuery.removeListener) {
          mediaQuery.removeListener(handleDisplayModeChange);
        }
      };
    } catch (error) {
      console.error('Error setting up PWA event listeners in safe hook:', error);
      return () => {}; // Empty cleanup function
    }
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setCanInstall(false);
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error('Error installing app:', error);
    }
  };

  return {
    isOnline,
    canInstall,
    isStandalone,
    installApp,
    deferredPrompt
  };
} 