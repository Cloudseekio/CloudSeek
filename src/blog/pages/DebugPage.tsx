import React from 'react';
import ErrorBoundary from '../../components/ErrorBoundary';
import ContentfulDebug from '../components/debug/ContentfulDebug';
import ConnectionStatus from '../components/debug/ConnectionStatus';
import ServiceHealthDebug from '../components/debug/ServiceHealthDebug';
import { isDebugMode } from '../routes/blogRoutes';

interface DebugPageProps {
  className?: string;
}

const DebugPage: React.FC<DebugPageProps> = ({ className = '' }) => {
  // Check if we're in debug mode
  const isInDebugMode = isDebugMode(window.location.pathname);

  if (!isInDebugMode) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
            Debug Mode Required
          </h2>
          <p className="text-yellow-600 dark:text-yellow-300 mb-4">
            To access the debug tools, you need to enable debug mode by adding <code>?debug=true</code> to the URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="container mx-auto p-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4">
              Error Loading Debug Tools
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-4">
              There was an error loading the debug tools. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      }
    >
      <div className={`container mx-auto p-4 ${className}`}>
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Contentful Debug Tools
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ConnectionStatus />
          <ServiceHealthDebug />
        </div>

        <ContentfulDebug />

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium mb-2">ℹ️ Debug Mode Information</p>
          <p>
            Debug mode is currently enabled. You can disable it by removing <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded">?debug=true</code> from the URL.
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DebugPage; 