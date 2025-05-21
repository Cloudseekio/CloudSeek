'use client';

import React from 'react';

interface ErrorMessageProps {
  title: string;
  message: string;
  retryButtonText?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ 
  title, 
  message, 
  retryButtonText = 'Retry',
  onRetry 
}: ErrorMessageProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // Default behavior is to reload the page
      window.location.reload();
    }
  };

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4">
        {title}
      </h2>
      <p className="text-red-600 dark:text-red-300 mb-4 whitespace-pre-wrap">
        {message}
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          {retryButtonText}
        </button>
      </div>
    </div>
  );
} 