import { useState } from 'react';
import type { FC } from 'react';
import { useSafePWA } from '../hooks/useSafePWA';
import { Download } from 'lucide-react';

interface PWAInstallPromptProps {
  className?: string;
}

const PWAInstallPrompt: FC<PWAInstallPromptProps> = ({ className = '' }) => {
  const { canInstall, installApp } = useSafePWA();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!canInstall || isDismissed) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Install Blog App
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Install our app for a better reading experience and offline access to articles.
          </p>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={() => installApp()}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Install
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt; 