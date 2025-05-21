'use client';

import React from 'react';
import { useContentfulConnection } from '../hooks/useContentfulConnection';

interface TestConnectionStatusProps {
  showDetails?: boolean;
  onRetry?: () => void;
}

/**
 * A component that displays the current Contentful connection status
 */
const TestConnectionStatus: React.FC<TestConnectionStatusProps> = ({ 
  showDetails = false,
  onRetry
}) => {
  const { status, error, checkConnection, isInitializing } = useContentfulConnection();
  
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      checkConnection();
    }
  };
  
  const getStatusStyles = () => {
    if (isInitializing) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
    }
    
    if (error) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200 dark:border-red-800';
    }
    
    if (status.isConnected) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200 dark:border-green-800';
    }
    
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusStyles()}`}>
      <div className="flex items-center">
        <div className="mr-3">
          {isInitializing ? (
            <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse"></div>
          ) : status.isConnected ? (
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
          ) : (
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
          )}
        </div>
        
        <div>
          <h3 className="font-medium">
            {isInitializing 
              ? 'Initializing connection...' 
              : status.isConnected 
                ? 'Connected to Contentful' 
                : 'Connection to Contentful failed'}
          </h3>
          
          {error && (
            <p className="text-sm mt-1">
              Error: {error.message}
            </p>
          )}
          
          {!isInitializing && !status.isConnected && (
            <button
              onClick={handleRetry}
              className="mt-2 px-3 py-1 text-sm bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
            >
              Retry Connection
            </button>
          )}
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-3 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div>Last checked:</div>
            <div>{status.lastChecked ? new Date(status.lastChecked).toLocaleString() : 'Never'}</div>
            
            <div>Contentful service:</div>
            <div>{status.services?.contentful ? 'Available' : 'Unavailable'}</div>
            
            <div>Image service:</div>
            <div>{status.services?.image ? 'Available' : 'Unavailable'}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestConnectionStatus;