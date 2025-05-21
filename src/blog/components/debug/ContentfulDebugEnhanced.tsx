import React, { useState } from 'react';
import ContentfulDebug from './ContentfulDebug';
import ContentTypeValidatorDemo from './ContentTypeValidatorDemo';

/**
 * Enhanced debug component that combines the original connection test
 * with the new content type validator
 */
const ContentfulDebugEnhanced: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connection' | 'validator'>('connection');
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contentful Debug</h1>
      
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === 'connection'
                  ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('connection')}
            >
              Connection Test
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${
                activeTab === 'validator'
                  ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                  : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('validator')}
            >
              Content Type Validator
            </button>
          </li>
        </ul>
      </div>
      
      {activeTab === 'connection' ? (
        <ContentfulDebug />
      ) : (
        <ContentTypeValidatorDemo />
      )}
    </div>
  );
};

export default ContentfulDebugEnhanced; 