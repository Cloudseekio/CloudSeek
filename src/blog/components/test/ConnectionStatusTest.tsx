import React from 'react';
import { useContentfulConnection } from '../../hooks/useContentfulConnection';

/**
 * Test component for verifying connection status
 */
export const ConnectionStatusTest: React.FC = () => {
  const { status, error, checkConnection, isInitializing } = useContentfulConnection();

  if (isInitializing) {
    return <div>Initializing services...</div>;
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Contentful Connection Status</h2>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <span className={`w-3 h-3 rounded-full mr-2 ${
            status.isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span>
            {status.isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Last checked: {new Date(status.lastChecked).toLocaleString()}
        </div>

        <div className="space-y-1">
          <div className="font-medium">Services:</div>
          <div className="ml-4">
            <div>Contentful: {status.services.contentful ? '✅' : '❌'}</div>
            <div>Image Service: {status.services.image ? '✅' : '❌'}</div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">
            {error.message}
          </div>
        )}

        <button
          onClick={() => checkConnection()}
          disabled={status.isChecking}
          className={`mt-4 px-4 py-2 rounded ${
            status.isChecking
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {status.isChecking ? 'Checking...' : 'Check Connection'}
        </button>
      </div>
    </div>
  );
}; 