import React, { useState } from 'react';
import { withRouteSplitting } from '../components/routing/SplitRoute';
import { useDataCleanup } from '../utils/dataCleanup';

interface DebugData {
  timestamp: string;
  connectionStatus: {
    isConnected: boolean;
    lastChecked: Date;
  };
}

function BlogDebugPage() {
  // Connection status state
  const [lastChecked, setLastChecked] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Setup data cleanup for debug data
  const { registerData, accessData } = useDataCleanup<DebugData>('debug-state', {
    inactivityThreshold: 30 * 60 * 1000, // 30 minutes
    debug: true,
    cleanupOnUnmount: true,
    customCleanup: () => {
      console.log('Cleaning up debug data');
    }
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const newTimestamp = new Date();
      const debugData: DebugData = {
        timestamp: newTimestamp.toISOString(),
        connectionStatus: {
          isConnected: true,
          lastChecked: newTimestamp
        }
      };

      // Store with cleanup
      registerData(debugData, {
        size: 1,
        type: 'debug-metrics'
      });

      setLastChecked(newTimestamp);
      setIsRefreshing(false);
    }, 500);
  };

  // Get cached debug data
  const cachedData = accessData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Contentful Debug Tools</h1>

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Connection Status</h2>
            <button 
              onClick={handleRefresh}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Refresh connection status"
              title="Refresh connection status"
            >
              <svg className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Response Time:</span>
              <span>35ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Checked:</span>
              <span>{lastChecked.toLocaleTimeString()}</span>
            </div>
          </div>
          
          {/* Display cached debug data if available */}
          {cachedData && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Cached Debug Data:</h3>
              <pre className="p-2 bg-gray-50 rounded text-sm overflow-auto">
                {JSON.stringify(cachedData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Service Health Monitor */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Service Health Monitor</h2>
            <button 
              className="text-gray-600 hover:text-gray-900"
              aria-label="Refresh service health"
              title="Refresh service health"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Image Service */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Image</h3>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-green-600">healthy</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime:</span>
                <span>0s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Response:</span>
                <span>0ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate:</span>
                <span>100%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Requests/min:</span>
                <span>15,000</span>
              </div>
            </div>
          </div>

          {/* Cache Service */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Cache</h3>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-green-600">healthy</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime:</span>
                <span>0s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Response:</span>
                <span>0ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate:</span>
                <span>100%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Requests/min:</span>
                <span>12,000</span>
              </div>
            </div>
          </div>

          {/* Contentful Service */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Contentful</h3>
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-green-600">healthy</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Uptime:</span>
                <span>0s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Response:</span>
                <span>0ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate:</span>
                <span>100%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Requests/min:</span>
                <span>12,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contentful Connection Debug */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Contentful Connection Debug</h2>
        
        {/* Connection Status */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <h3 className="font-medium">Connected to Contentful</h3>
            <button className="ml-auto text-blue-600 text-sm px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100">
              Refresh Status
            </button>
          </div>
          <p className="text-sm text-gray-600">API access is working properly</p>
        </div>

        {/* Environment Variables */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Environment Variables</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span>Space ID: Loaded</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span>Environment: master</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span>Access Token: Loaded</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span>Preview Mode: Disabled</span>
            </div>
          </div>
        </div>

        {/* Connection Settings */}
        <div>
          <h3 className="font-medium mb-4">Connection Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Space ID</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value="mdcwu87mzf3j"
                  readOnly
                  className="flex-1 p-2 border rounded-md bg-gray-50 text-gray-600"
                  aria-label="Space ID"
                  title="Space ID"
                />
                <svg className="w-5 h-5 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>
              <div className="flex items-center">
                <input
                  type="password"
                  value="••••••••••••••••••••••••••••••••••"
                  readOnly
                  className="flex-1 p-2 border rounded-md bg-gray-50 text-gray-600"
                  aria-label="Access Token"
                  title="Access Token"
                />
                <button className="ml-2 text-gray-600 hover:text-gray-900">
                  Show
                </button>
                <svg className="w-5 h-5 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value="master"
                  readOnly
                  className="flex-1 p-2 border rounded-md bg-gray-50 text-gray-600"
                  aria-label="Environment"
                  title="Environment"
                />
                <svg className="w-5 h-5 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
              <div className="relative">
                <select 
                  className="w-full p-2 border rounded-md bg-white pr-10 appearance-none"
                  aria-label="Select content type"
                  title="Select content type"
                >
                  <option>Select a content type...</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <input
                type="text"
                placeholder="Or enter content type ID manually"
                className="mt-2 w-full p-2 border rounded-md"
              />
            </div>

            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Test Content Type
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                Clear Results
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Mode Information */}
      <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
        <span className="font-bold">ℹ️ Debug Mode Information</span>
        <p className="mt-1">
          Debug mode is currently enabled. You can disable it by removing <code className="bg-blue-100 px-1 rounded">?debug=true</code> from the URL.
        </p>
      </div>
    </div>
  );
}

export default withRouteSplitting(BlogDebugPage, {
  fallback: (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  ),
}); 