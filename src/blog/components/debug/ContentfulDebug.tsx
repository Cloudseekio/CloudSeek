import React, { useState, useEffect } from 'react';
import { environmentConfig } from '../../../config/environment';
import { getContentfulService } from '../../services/serviceFactory';
import logger from '../../../utils/logger';

interface ContentfulEntry {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      }
    };
    createdAt: string;
    updatedAt: string;
  };
  fields: Record<string, unknown>;
}

interface ContentfulError {
  message: string;
  details?: string;
  type: 'connection' | 'authentication' | 'notFound' | 'config' | 'generic';
  timestamp: number;
}

// Common content types in Contentful
const COMMON_CONTENT_TYPES = [
  { id: 'blogPost', name: 'Blog Post' },
  { id: 'author', name: 'Author' },
  { id: 'category', name: 'Category' },
  { id: 'tag', name: 'Tag' },
  { id: 'asset', name: 'Asset (Media)' }
];

/**
 * Debug component for testing Contentful connection and content types
 */
const ContentfulDebug: React.FC = () => {
  const [entries, setEntries] = useState<ContentfulEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ContentfulError | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [spaceId, setSpaceId] = useState<string>('');
  const [environment, setEnvironment] = useState<string>('master');
  const [contentType, setContentType] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [availableContentTypes, setAvailableContentTypes] = useState<Array<{id: string, name: string}>>([]);
  const [showSecrets, setShowSecrets] = useState<boolean>(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState<boolean>(false);

  // Load environment configuration on mount
  useEffect(() => {
    try {
      const { contentful } = environmentConfig;
      
      logger.debug('ContentfulDebug: Loading environment configuration');
      
      const spaceLoaded = !!contentful.spaceId;
      const tokenLoaded = !!contentful.accessToken;
      const previewTokenLoaded = !!contentful.previewToken;
      
      logger.debug(`ContentfulDebug: Space ID found: ${spaceLoaded ? 'Yes' : 'No'}`);
      logger.debug(`ContentfulDebug: Access Token found: ${tokenLoaded ? 'Yes' : 'No'}`);
      logger.debug(`ContentfulDebug: Preview Token found: ${previewTokenLoaded ? 'Yes' : 'No'}`);
      logger.debug(`ContentfulDebug: Environment: ${contentful.environment}`);
      logger.debug(`ContentfulDebug: Preview Mode: ${contentful.usePreview ? 'Yes' : 'No'}`);
      
      // Set state based on environment configuration
      setAccessToken(contentful.usePreview && contentful.previewToken 
        ? contentful.previewToken 
        : contentful.accessToken);
      setSpaceId(contentful.spaceId);
      setEnvironment(contentful.environment);
      
      // Set initial common content types
      setAvailableContentTypes(COMMON_CONTENT_TYPES);

      // Check connection status
      checkConnection();
    } catch (error) {
      logger.error('ContentfulDebug: Failed to load environment configuration:', error);
      setError({
        message: 'Failed to load environment configuration',
        details: error instanceof Error ? error.message : String(error),
        type: 'config',
        timestamp: Date.now()
      });
      setConnectionStatus('disconnected');
    }
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    setIsCheckingConnection(true);
    setError(null);
    
    try {
      const service = getContentfulService();
      const client = await service.getClient();
      
      // Test connection by attempting to get a single entry
      await client.getEntries({ limit: 1 });
      
      // If we got here, connection is successful
      setConnectionStatus('connected');
      
      // Try to detect available content types
      try {
        // Use proper contentful API for fetching content types
        const contentTypesResponse = await client.getContentTypes();
        const mappedTypes = contentTypesResponse.items.map(type => ({
          id: type.sys.id,
          name: type.name
        }));
        setAvailableContentTypes([...mappedTypes]);
        logger.debug(`ContentfulDebug: Detected ${mappedTypes.length} content types`);
      } catch (contentTypeError) {
        // If we can't get content types, still keep the connection status as connected
        // but log the error
        logger.warn('ContentfulDebug: Failed to fetch content types:', contentTypeError);
      }
    } catch (err) {
      logger.error('ContentfulDebug: Connection check failed:', err);
      setConnectionStatus('disconnected');
      
      // Determine the specific error type for better messaging
      let errorType: ContentfulError['type'] = 'generic';
      let errorMessage = 'Failed to connect to Contentful';
      let errorDetails = '';
      
      if (err instanceof Error) {
        errorDetails = err.message;
        
        // Check for common Contentful error patterns
        if (err.message.includes('access token') || err.message.includes('401')) {
          errorType = 'authentication';
          errorMessage = 'Authentication failed - invalid access token';
        } else if (err.message.includes('space') || err.message.includes('404')) {
          errorType = 'notFound';
          errorMessage = 'Space not found - invalid space ID';
        } else if (err.message.includes('network') || err.message.includes('timeout')) {
          errorType = 'connection';
          errorMessage = 'Network connection issue - cannot reach Contentful API';
        }
      }
      
      setError({
        message: errorMessage,
        details: errorDetails,
        type: errorType,
        timestamp: Date.now()
      });
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const fetchEntries = async () => {
    if (!spaceId || !accessToken || !contentType) {
      setError({
        message: 'Missing required information',
        details: 'Please provide Space ID, Access Token, and Content Type',
        type: 'config',
        timestamp: Date.now()
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const service = getContentfulService();
      const client = await service.getClient();
      
      const response = await client.getEntries({
        content_type: contentType,
        limit: 10
      });

      setEntries(response.items as ContentfulEntry[]);
      
      if (response.items.length === 0) {
        logger.info(`ContentfulDebug: No entries found for content type "${contentType}"`);
      } else {
        logger.debug(`ContentfulDebug: Fetched ${response.items.length} entries of type "${contentType}"`);
      }
      
    } catch (err) {
      logger.error('ContentfulDebug: Failed to fetch entries:', err);
      
      let errorType: ContentfulError['type'] = 'generic';
      let errorMessage = 'Failed to fetch entries';
      let errorDetails = '';
      
      if (err instanceof Error) {
        errorDetails = err.message;
        
        if (err.message.includes('content type') || err.message.includes('does not exist')) {
          errorType = 'notFound';
          errorMessage = `Content type "${contentType}" not found`;
        } else if (err.message.includes('access') || err.message.includes('permission')) {
          errorType = 'authentication';
          errorMessage = 'Permission denied - check access rights';
        }
      }
      
      setError({
        message: errorMessage,
        details: errorDetails,
        type: errorType,
        timestamp: Date.now()
      });
      
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorIcon = (errorType: ContentfulError['type']) => {
    switch (errorType) {
      case 'authentication':
        return '🔒';
      case 'connection':
        return '🌐';
      case 'notFound':
        return '🔍';
      case 'config':
        return '⚙️';
      default:
        return '❌';
    }
  };

  const handleContentTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setContentType(e.target.value);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Contentful Connection Debug
      </h2>

      {/* Connection Status with Enhanced Visualization */}
      <div className="mb-6 p-4 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Connection Status</h3>
          <button 
            onClick={checkConnection}
            disabled={isCheckingConnection}
            className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition"
          >
            {isCheckingConnection ? 'Checking...' : 'Refresh Status'}
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <span className={`inline-block w-4 h-4 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'checking' ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
            {connectionStatus === 'checking' && (
              <span className="absolute inset-0 w-4 h-4 rounded-full bg-yellow-500 animate-ping opacity-75"></span>
            )}
          </div>
          
          <div>
            <span className="font-medium">
              {connectionStatus === 'connected' ? 'Connected to Contentful' :
              connectionStatus === 'checking' ? 'Checking Connection...' :
              'Disconnected'}
            </span>
            
            {connectionStatus === 'connected' && (
              <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                API access is working properly
              </p>
            )}
            
            {connectionStatus === 'disconnected' && error && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {error.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Environment Variables Status */}
      <div className="mb-6 p-4 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <h3 className="font-medium mb-2">Environment Variables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <span className={`inline-block w-2 h-2 rounded-full ${spaceId ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>Space ID: {spaceId ? 'Loaded' : 'Missing'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-block w-2 h-2 rounded-full ${accessToken ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>Access Token: {accessToken ? 'Loaded' : 'Missing'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-block w-2 h-2 rounded-full ${environment ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span>Environment: {environment || 'Default (master)'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            <span>Preview Mode: {environmentConfig.contentful.usePreview ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Connection Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Space ID</label>
            <div className="relative">
              <input
                type="text"
                value={spaceId}
                onChange={(e) => setSpaceId(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Contentful Space ID"
              />
              {spaceId && (
                <span className="absolute right-2 top-2 text-green-500">✓</span>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Access Token
              <span className="ml-2">
                <button 
                  onClick={() => setShowSecrets(!showSecrets)} 
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  {showSecrets ? 'Hide' : 'Show'}
                </button>
              </span>
            </label>
            <div className="relative">
              <input
                type={showSecrets ? "text" : "password"}
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Content Delivery API Token"
              />
              {accessToken && (
                <span className="absolute right-2 top-2 text-green-500">✓</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Environment</label>
            <input
              type="text"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="Environment (default: master)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" id="content-type-label">Content Type</label>
            <div className="relative">
              <select
                value={contentType}
                onChange={handleContentTypeSelect}
                className="w-full p-2 border rounded appearance-none dark:bg-gray-700 dark:border-gray-600"
                aria-labelledby="content-type-label"
              >
                <option value="">Select a content type...</option>
                {availableContentTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.id})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="mt-1">
              <input
                type="text"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="Or enter content type ID manually"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-6">
        <button 
          onClick={fetchEntries}
          disabled={isLoading || !spaceId || !accessToken || !contentType}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Testing...
            </>
          ) : (
            'Test Content Type'
          )}
        </button>
        
        <button 
          onClick={() => setEntries([])}
          disabled={entries.length === 0}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Clear Results
        </button>
      </div>

      {/* Enhanced Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <div className="flex items-start">
            <div className="text-xl mr-3">{getErrorIcon(error.type)}</div>
            <div>
              <h4 className="font-medium text-red-700 dark:text-red-400">
                {error.message}
              </h4>
              {error.details && (
                <details className="mt-1">
                  <summary className="text-sm text-red-600 dark:text-red-500 cursor-pointer">
                    View error details
                  </summary>
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500 p-2 bg-red-100 dark:bg-red-900/30 rounded">
                    {error.details}
                  </p>
                </details>
              )}
              {error.type === 'authentication' && (
                <p className="text-sm mt-1 text-red-600 dark:text-red-500">
                  Tip: Check that your access token is correct and has permission to access this space.
                </p>
              )}
              {error.type === 'notFound' && (
                <p className="text-sm mt-1 text-red-600 dark:text-red-500">
                  Tip: Verify that the space ID and content type are correct.
                </p>
              )}
              {error.type === 'connection' && (
                <p className="text-sm mt-1 text-red-600 dark:text-red-500">
                  Tip: Check your internet connection and try again.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {entries.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Test Results ({entries.length} entries)</h3>
          <div className="space-y-4">
            {entries.map((entry) => (
              <div 
                key={entry.sys.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium">ID: {entry.sys.id}</span>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded mr-2">
                      {entry.sys.contentType.sys.id}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(entry.sys.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <pre className="text-sm overflow-auto max-h-40 p-2 bg-white dark:bg-gray-800 rounded">
                  {JSON.stringify(entry.fields, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : contentType && !error ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-center">Click "Test Content Type" to fetch entries</p>
        </div>
      ) : null}
    </div>
  );
};

export default ContentfulDebug; 