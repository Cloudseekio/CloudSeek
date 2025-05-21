import React, { useEffect, useState } from 'react';
import { AlertCircle, Clock, Trash2 } from 'lucide-react';

interface ErrorEntry {
  id: string;
  timestamp: number;
  message: string;
  code?: string;
  service: string;
  details?: string;
}

interface ErrorHistoryProps {
  className?: string;
  maxEntries?: number;
}

const ErrorHistory: React.FC<ErrorHistoryProps> = ({ 
  className = '',
  maxEntries = 50
}) => {
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [selectedError, setSelectedError] = useState<ErrorEntry | null>(null);

  useEffect(() => {
    // Load errors from localStorage on mount
    const storedErrors = localStorage.getItem('debug_error_history');
    if (storedErrors) {
      try {
        setErrors(JSON.parse(storedErrors));
      } catch (e) {
        console.error('Failed to parse stored errors:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Subscribe to error events
    const handleError = (event: CustomEvent<ErrorEntry>) => {
      setErrors(prev => {
        const newErrors = [event.detail, ...prev].slice(0, maxEntries);
        localStorage.setItem('debug_error_history', JSON.stringify(newErrors));
        return newErrors;
      });
    };

    window.addEventListener('contentful-error' as any, handleError);
    return () => window.removeEventListener('contentful-error' as any, handleError);
  }, [maxEntries]);

  const clearHistory = () => {
    setErrors([]);
    localStorage.removeItem('debug_error_history');
    setSelectedError(null);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Error History
          </h2>
          <button
            onClick={clearHistory}
            className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            aria-label="Clear error history"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {errors.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                No errors recorded
              </div>
            ) : (
              errors.map(error => (
                <button
                  key={error.id}
                  onClick={() => setSelectedError(error)}
                  className={`w-full text-left p-4 rounded-lg border dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800 transition-colors
                    ${selectedError?.id === error.id ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20' : ''}`}
                >
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="flex-grow">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {error.service}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {error.message}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(error.timestamp)}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="lg:border-l lg:dark:border-gray-700 lg:pl-6">
            {selectedError ? (
              <div className="space-y-4">
                <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                  Error Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Service</label>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedError.service}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Timestamp</label>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatTime(selectedError.timestamp)}
                    </div>
                  </div>
                  {selectedError.code && (
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Error Code</label>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedError.code}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-500 dark:text-gray-400">Message</label>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedError.message}
                    </div>
                  </div>
                  {selectedError.details && (
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Details</label>
                      <pre className="mt-1 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm font-mono overflow-x-auto">
                        {selectedError.details}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                Select an error to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorHistory; 