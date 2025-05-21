import React, { useState, useEffect } from 'react';
import { getContentfulService } from '../../services/serviceFactory';
import { validateContentTypes, ValidationResult } from '../../utils/contentTypeValidator';
import logger from '../../../utils/logger';

/**
 * Demo component for the content type validator
 * Shows validation results and allows manual validation
 */
const ContentTypeValidatorDemo: React.FC = () => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runValidation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contentfulService = getContentfulService();
      const client = contentfulService.getClient();
      
      logger.info('Running content type validation');
      const result = await validateContentTypes(client);
      
      setValidationResult(result);
      logger.info('Content type validation complete', { 
        isValid: result.isValid,
        errors: result.errors.length
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to validate content types: ${errorMessage}`);
      logger.error('Content type validation failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Run validation on component mount
    runValidation();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Content Type Validator
      </h2>
      
      <div className="mb-4">
        <button
          onClick={runValidation}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Validating...' : 'Validate Content Types'}
        </button>
      </div>
      
      {error && (
        <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {validationResult && (
        <div className="space-y-4">
          <div className={`p-4 rounded-md ${
            validationResult.isValid 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
          }`}>
            <p className={`font-semibold ${
              validationResult.isValid 
                ? 'text-green-700 dark:text-green-400' 
                : 'text-yellow-700 dark:text-yellow-400'
            }`}>
              {validationResult.isValid 
                ? 'All content types are valid!' 
                : `Found ${validationResult.errors.length} content type issues`}
            </p>
          </div>
          
          {validationResult.missingTypes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                Missing Content Types
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {validationResult.missingTypes.map((type, index) => (
                  <li key={index} className="text-red-600 dark:text-red-400">
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {validationResult.unexpectedTypes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                Unexpected Content Types
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {validationResult.unexpectedTypes.map((type, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-400">
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Valid Content Types by Category
            </h3>
            
            {Object.entries(validationResult.validContentTypes).map(([category, types]) => (
              <div key={category} className="mb-3">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">{category}</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {types.map((type, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentTypeValidatorDemo; 