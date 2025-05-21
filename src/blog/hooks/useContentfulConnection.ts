'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { initializeServices, getInitializationStatus } from '../services/serviceFactory';
import logger from '../../utils/logger';
import { ConfigVerificationError } from '../services/configVerifier';

/**
 * Connection status interface
 */
export interface ConnectionStatus {
  isConnected: boolean;
  lastChecked: number;
  isChecking: boolean;
  services: {
    contentful: boolean;
    image: boolean;
  };
}

/**
 * Hook return type
 */
export interface UseContentfulConnectionReturn {
  status: ConnectionStatus;
  error: Error | null;
  checkConnection: () => Promise<void>;
  isInitializing: boolean;
}

/**
 * Default connection status
 */
const DEFAULT_STATUS: ConnectionStatus = {
  isConnected: false,
  lastChecked: 0,
  isChecking: false,
  services: {
    contentful: false,
    image: false
  }
};

/**
 * Hook for managing Contentful connection status
 */
export const useContentfulConnection = (): UseContentfulConnectionReturn => {
  const [status, setStatus] = useState<ConnectionStatus>(DEFAULT_STATUS);
  const [error, setError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const mountedRef = useRef(true);

  /**
   * Check connection status
   */
  const checkConnection = useCallback(async () => {
    if (status.isChecking) {
      logger.debug('Connection check skipped - already in progress');
      return;
    }

    setStatus(prev => ({ ...prev, isChecking: true }));
    setError(null);
    
    try {
      logger.debug('Running connection check...', {
        env: {
          spaceId: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
          hasAccessToken: !!import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
          environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
          usePreview: import.meta.env.VITE_CONTENTFUL_PREVIEW_MODE === 'true'
        }
      });
      
      const serviceStatus = await initializeServices();
      
      logger.debug('Service initialization result:', {
        initialized: serviceStatus.initialized,
        services: serviceStatus.services,
        error: serviceStatus.error?.message
      });
      
      if (mountedRef.current) {
        setStatus({
          isConnected: serviceStatus.initialized,
          lastChecked: Date.now(),
          isChecking: false,
          services: serviceStatus.services
        });

        // Even if initialized is true, still check for errors
        if (serviceStatus.error) {
          throw serviceStatus.error;
        }

        logger.info('Connection check successful', {
          services: serviceStatus.services
        });
      }
      
    } catch (err) {
      if (!mountedRef.current) return;

      let errorMessage = 'Failed to connect to Contentful';
      
      if (err instanceof ConfigVerificationError) {
        errorMessage = `Configuration error: ${err.formatDetails()}`;
        logger.error('Configuration verification failed:', {
          details: err.formatDetails(),
          raw: err
        });
      } else if (err instanceof Error) {
        errorMessage = err.message;
        logger.error('Connection error:', {
          message: err.message,
          stack: err.stack
        });
      } else {
        logger.error('Unknown connection error:', err);
      }
      
      const error = new Error(errorMessage);
      setError(error);
      
      // Update status to indicate check completed but failed
      setStatus(prev => ({ 
        ...prev, 
        isChecking: false,
        isConnected: false
      }));
      
      logger.error('Connection check failed:', {
        error: errorMessage,
        status: status.services
      });
      
    } finally {
      if (mountedRef.current) {
        setIsInitializing(false);
      }
    }
  }, [status.isChecking, status.services]);

  /**
   * Initialize connection on mount
   */
  useEffect(() => {
    mountedRef.current = true;
    
    // Check if services are already initialized
    const currentStatus = getInitializationStatus();
    
    logger.debug('Initial connection status check:', {
      currentStatus,
      isInitialized: currentStatus.initialized
    });
    
    if (currentStatus.initialized) {
      setStatus({
        isConnected: true,
        lastChecked: Date.now(),
        isChecking: false,
        services: currentStatus.services
      });
      setIsInitializing(false);
      setError(null);
      return;
    }

    // Otherwise check connection
    checkConnection();

    return () => {
      mountedRef.current = false;
    };
  }, [checkConnection]);

  // Add an effect to periodically check the connection ONLY if there's an error
  useEffect(() => {
    if (!mountedRef.current || isInitializing || status.isConnected || status.isChecking) {
      return;
    }

    // Only set up periodic checks if there's an error
    if (error) {
      const checkInterval = 60 * 1000; // Check every minute
      const intervalId = setInterval(() => {
        if (mountedRef.current && !status.isConnected) {
          checkConnection();
        }
      }, checkInterval);
      
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [checkConnection, error, isInitializing, status.isConnected, status.isChecking]);

  return {
    status,
    error,
    checkConnection,
    isInitializing
  };
}; 