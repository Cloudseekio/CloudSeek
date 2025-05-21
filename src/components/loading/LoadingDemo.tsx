import React, { useState, useEffect } from 'react';
import { useLoading } from '../../context/LoadingContext';
import LoadingUI, { LoadingVariant, LoadingSize } from './LoadingUI';

/**
 * A component to demonstrate the different loading variants and configurations
 */
export const LoadingDemo: React.FC = () => {
  const { startLoading, stopLoading, setProgress } = useLoading();
  const [demoLoading, setDemoLoading] = useState(false);
  const [variant, setVariant] = useState<LoadingVariant>('spinner');
  const [size, setSize] = useState<LoadingSize>('md');
  const [showMessage, setShowMessage] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setLocalProgress] = useState(0);
  const [useContext, setUseContext] = useState(false);
  const loadingKey = 'demo-loading';
  const [fullScreen, setFullScreen] = useState(false);
  
  // Demo loading with auto-incremented progress
  useEffect(() => {
    if (demoLoading && !useContext) {
      // Reset progress when starting
      setLocalProgress(0);
      
      // Auto-increment progress
      const interval = setInterval(() => {
        setLocalProgress(prev => {
          const nextProgress = prev + (Math.random() * 5);
          if (nextProgress >= 100) {
            // Stop loading when reaching 100%
            setDemoLoading(false);
            clearInterval(interval);
            return 100;
          }
          return nextProgress;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [demoLoading, useContext]);
  
  // For context-based loading
  useEffect(() => {
    if (useContext && demoLoading) {
      startLoading(loadingKey, 'Loading demonstration...');
      
      // Manually update progress if not using auto progress
      if (variant === 'progress') {
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              stopLoading(loadingKey);
              setDemoLoading(false);
              return 100;
            }
            return prev + (Math.random() * 5);
          });
        }, 300);
        
        return () => clearInterval(interval);
      }
      
      // Auto stop after 5 seconds for demonstration purposes
      const timeout = setTimeout(() => {
        stopLoading(loadingKey);
        setDemoLoading(false);
      }, 5000);
      
      return () => {
        clearTimeout(timeout);
        stopLoading(loadingKey);
      };
    }
  }, [useContext, demoLoading, startLoading, stopLoading, setProgress, variant, loadingKey]);
  
  // Handle toggling the loading state
  const toggleLoading = () => {
    setDemoLoading(prev => !prev);
  };
  
  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Loading System Demo</h1>
      
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Loading Variant</h2>
          <div className="flex flex-wrap gap-2">
            {(['spinner', 'dots', 'progress', 'skeleton', 'pulse', 'blur', 'overlay', 'inline', 'minimal'] as LoadingVariant[]).map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={`px-3 py-1 rounded-full text-sm ${
                  variant === v
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Size</h2>
          <div className="flex flex-wrap gap-2">
            {(['xs', 'sm', 'md', 'lg', 'xl'] as LoadingSize[]).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-3 py-1 rounded-full text-sm ${
                  size === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Options</h2>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showMessage}
                onChange={() => setShowMessage(prev => !prev)}
                className="rounded"
              />
              <span>Show Message</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showProgress}
                onChange={() => setShowProgress(prev => !prev)}
                className="rounded"
              />
              <span>Show Progress</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useContext}
                onChange={() => setUseContext(prev => !prev)}
                className="rounded"
              />
              <span>Use Context</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={fullScreen}
                onChange={() => setFullScreen(prev => !prev)}
                className="rounded"
              />
              <span>Full Screen</span>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <button
            onClick={toggleLoading}
            className={`px-4 py-2 rounded-md font-medium text-white ${
              demoLoading
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {demoLoading ? 'Stop Loading' : 'Start Loading'}
          </button>
        </div>
      </div>
      
      {/* Demo Area */}
      <div className="mt-8 p-6 border rounded-lg dark:border-gray-700 relative min-h-[200px] flex items-center justify-center">
        <LoadingUI
          variant={variant}
          size={size}
          isLoading={useContext ? undefined : demoLoading}
          loadingKey={useContext ? loadingKey : undefined}
          message="Loading demonstration content..."
          showMessage={showMessage}
          showProgress={showProgress}
          progress={useContext ? undefined : progress}
          fullScreen={fullScreen}
        >
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">
              This content will be overlaid with the loading indicator for overlay, blur, and pulse variants.
            </p>
          </div>
        </LoadingUI>
      </div>
      
      {/* Explanation */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How to Use</h2>
        <p className="mb-2">The LoadingUI component can be used in several ways:</p>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Directly control with the <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">isLoading</code> prop</li>
          <li>Connect to the global loading state with <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">loadingKey</code></li>
          <li>Wrap content for overlay effects</li>
          <li>Show with custom progress values</li>
          <li>Use with different sizes and variants</li>
        </ul>
        <p className="mt-2 text-sm">
          The component respects ARIA attributes and provides screen reader announcements for accessibility.
        </p>
      </div>
    </div>
  );
};

export default LoadingDemo; 