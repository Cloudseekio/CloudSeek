import React from 'react';
import { cn } from '../../utils/cn';
import { useLoading } from '../../context/LoadingContext';
import { SkeletonText } from '../skeleton';

interface LoadingOverlayProps {
  loadingKey?: string;
  className?: string;
  blur?: boolean;
  fullScreen?: boolean;
  showMessage?: boolean;
  children?: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loadingKey,
  className = '',
  blur = true,
  fullScreen = false,
  showMessage = true,
  children
}) => {
  const { isLoading, loadingKeys, getMessage } = useLoading();
  const isVisible = loadingKey 
    ? loadingKeys.has(loadingKey)
    : isLoading;
  
  const message = loadingKey ? getMessage(loadingKey) : undefined;

  if (!isVisible) {
    return <>{children}</>;
  }

  return (
    <div className={cn('relative', className)}>
      {children}
      <div
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center',
          blur && 'backdrop-blur-sm',
          fullScreen && 'fixed z-50',
          'bg-white/80 dark:bg-gray-900/80'
        )}
      >
        <div className="flex flex-col items-center space-y-4 p-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          {showMessage && (message || isLoading) && (
            <div className="text-center">
              {message ? (
                <p className="text-gray-600 dark:text-gray-300">{message}</p>
              ) : (
                <SkeletonText width={200} className="mx-auto" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 