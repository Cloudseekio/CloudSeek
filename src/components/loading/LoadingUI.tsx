import React from 'react';
import { cn } from '../../utils/cn';
import { useLoading } from '../../context/LoadingContext';
import LoadingIndicator from './LoadingIndicator';
import SkeletonLoader from './SkeletonLoader';
import { FadeTransition } from '../animation/FadeTransition';

export type LoadingVariant = 
  | 'spinner'      // Spinning circle animation
  | 'dots'         // Animated dots
  | 'progress'     // Progress bar
  | 'skeleton'     // Skeleton placeholders
  | 'pulse'        // Pulsing overlay
  | 'blur'         // Blurred content with spinner
  | 'overlay'      // Full overlay with spinner
  | 'inline'       // Inline loading indicator for buttons/links
  | 'minimal'      // Minimal indicator for non-intrusive loading
  | 'bar'          // Bar animation
  | 'circular';    // Circular animation

export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface LoadingUIProps {
  /**
   * Whether the loading indicator is visible
   */
  isLoading?: boolean;
  
  /**
   * Loading key to check against the LoadingContext
   */
  loadingKey?: string;
  
  /**
   * Visual variant of the loading indicator
   */
  variant?: LoadingVariant;
  
  /**
   * Size of the loading indicator
   */
  size?: LoadingSize;
  
  /**
   * Custom message to display
   */
  message?: string;
  
  /**
   * Whether to show a message with the loading indicator
   */
  showMessage?: boolean;
  
  /**
   * CSS class to apply to the loading container
   */
  className?: string;
  
  /**
   * Content to display when loading
   * Will be covered by the loading indicator if variant is 'overlay' or 'blur'
   */
  children?: React.ReactNode;
  
  /**
   * Whether to animate the loading indicator
   */
  animate?: boolean;
  
  /**
   * Whether the loading indicator should take up the full screen
   */
  fullScreen?: boolean;
  
  /**
   * Whether to show progress information
   */
  showProgress?: boolean;
  
  /**
   * Custom progress value (0-100)
   */
  progress?: number;
  
  /**
   * Additional ARIA label for accessibility
   */
  ariaLabel?: string;
  
  /**
   * Delay in ms before showing the loading indicator
   */
  delay?: number;
  
  /**
   * Custom color for the loading indicator
   */
  color?: string;
  
  /**
   * Duration of entry/exit animations in ms
   */
  transitionDuration?: number;
}

/**
 * A unified loading component that adapts to different contexts and requirements
 */
export const LoadingUI: React.FC<LoadingUIProps> = ({
  isLoading: externalIsLoading,
  loadingKey,
  variant = 'spinner',
  size = 'md',
  message,
  showMessage = false,
  className = '',
  children,
  animate = true,
  fullScreen = false,
  showProgress = false,
  progress: externalProgress,
  ariaLabel,
  delay = 0,
  color,
  transitionDuration = 300
}) => {
  // Get loading state from context if loadingKey is provided
  const { isLoading: contextIsLoading, getMessage, loadingProgress } = useLoading();
  
  // Determine if we're loading based on props or context
  const isLoading = loadingKey 
    ? contextIsLoading && loadingKey 
    : externalIsLoading !== undefined 
      ? externalIsLoading 
      : contextIsLoading;
      
  // Get message from context if not provided in props
  const displayMessage = message || (loadingKey ? getMessage(loadingKey) : '');
  
  // Get progress from props or context
  const progress = externalProgress !== undefined 
    ? externalProgress 
    : loadingProgress;
  
  // If not loading and not fullScreen, just return children
  if (!isLoading && !fullScreen) {
    return <>{children}</>;
  }
  
  // Format progress for display
  const progressPercent = `${Math.round(progress || 0)}%`;
  
  // Generate ARIA attributes
  const ariaAttributes = {
    role: 'status' as const,
    'aria-live': 'polite' as const,
    'aria-busy': isLoading as unknown as React.AriaAttributes['aria-busy'],
    'aria-label': ariaLabel || 'Loading content',
  };
  
  // Map our variant to LoadingIndicator variant
  const getIndicatorVariant = () => {
    switch(variant) {
      case 'spinner': return 'spinner';
      case 'dots': return 'dots';
      case 'circular': return 'circular';
      case 'pulse': return 'pulse';
      case 'bar': return 'bar';
      case 'minimal': return 'dots';
      case 'inline': return 'spinner';
      default: return 'spinner';
    }
  };
  
  // Map our size to LoadingIndicator size
  const getIndicatorSize = () => {
    switch(size) {
      case 'xs': return 'xs';
      case 'sm': return 'sm';
      case 'md': return 'md';
      case 'lg': return 'lg';
      case 'xl': return 'xl';
      default: return 'md';
    }
  };
  
  // Render different loading indicators based on variant
  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'skeleton':
        return (
          <div className="space-y-4 w-full max-w-md mx-auto">
            {showMessage && displayMessage && (
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
                {displayMessage}
              </p>
            )}
            <SkeletonLoader 
              variant="text" 
              rows={1} 
              height={24} 
              width="100%" 
              animation={animate ? 'pulse' : 'none'} 
              loading={Boolean(isLoading)}
            />
            <SkeletonLoader 
              variant="text" 
              rows={3} 
              height={16} 
              width="100%" 
              animation={animate ? 'pulse' : 'none'} 
              loading={Boolean(isLoading)}
            />
            <div className="flex justify-between">
              <SkeletonLoader 
                variant="text" 
                width="30%" 
                height={14} 
                animation={animate ? 'pulse' : 'none'} 
                loading={Boolean(isLoading)}
              />
              <SkeletonLoader 
                variant="text" 
                width="20%" 
                height={14} 
                animation={animate ? 'pulse' : 'none'} 
                loading={Boolean(isLoading)}
              />
            </div>
          </div>
        );
        
      case 'progress':
        // Only show progress variant if showProgress is true or variant is explicitly 'progress'
        if (!showProgress && variant !== 'progress') {
          // Use enhanced LoadingIndicator as fallback
          return (
            <div className="flex flex-col items-center justify-center space-y-3">
              <LoadingIndicator 
                variant="spinner" 
                size={getIndicatorSize()}
                label={showMessage ? displayMessage : undefined}
                loading={Boolean(isLoading)}
                color={color ? "custom" : "primary"}
                customColor={color}
                speed={animate ? 1 : 0}
              />
            </div>
          );
        }
        
        return (
          <div className="w-full max-w-xs space-y-2">
            <div className="relative pt-1">
              <div className="flex items-center justify-between">
                {showMessage && (
                  <div>
                    <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-500">
                      {displayMessage || 'Loading...'}
                    </span>
                  </div>
                )}
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-500">
                    {progressPercent}
                  </span>
                </div>
              </div>
              <div className="flex h-2 mt-1 overflow-hidden text-xs bg-blue-200 dark:bg-gray-700 rounded-full">
                <div
                  style={{ width: progressPercent }}
                  className="flex flex-col justify-center text-center text-white bg-blue-600 dark:bg-blue-500 rounded-full shadow-none whitespace-nowrap transition-all duration-300"
                />
              </div>
            </div>
          </div>
        );
        
      case 'inline':
        return (
          <span className="inline-flex items-center">
            <LoadingIndicator 
              variant="spinner" 
              size="xs"
              label={showMessage ? (displayMessage || 'Loading...') : undefined}
              color={color ? "custom" : "primary"}
              customColor={color}
              loading={Boolean(isLoading)}
              speed={animate ? 1 : 0}
            />
          </span>
        );
        
      case 'minimal':
        return (
          <div className="inline-flex items-center">
            <LoadingIndicator 
              variant="dots" 
              size="xs"
              label={showMessage ? displayMessage : undefined}
              color={color ? "custom" : "primary"}
              customColor={color}
              loading={Boolean(isLoading)}
              speed={animate ? 1 : 0}
            />
          </div>
        );
        
      default:
        // Use enhanced LoadingIndicator for all other cases
        return (
          <div className="flex flex-col items-center justify-center space-y-3">
            <LoadingIndicator 
              variant={getIndicatorVariant()} 
              size={getIndicatorSize()}
              label={showMessage ? displayMessage : undefined}
              loading={Boolean(isLoading)}
              color={color ? "custom" : "primary"}
              customColor={color}
              speed={animate ? 1 : 0}
            />
          </div>
        );
    }
  };
  
  // Handle overlay and blur variants that need to wrap content
  if (variant === 'overlay' || variant === 'blur' || variant === 'pulse') {
    return (
      <div className={cn('relative', className)} {...ariaAttributes}>
        {children}
        
        <FadeTransition 
          in={Boolean(isLoading)} 
          enterDuration={transitionDuration}
          exitDuration={transitionDuration}
          enterDelay={delay}
          mountOnEnter
          unmountOnExit
        >
          <div
            className={cn(
              'absolute inset-0 flex flex-col items-center justify-center',
              fullScreen && 'fixed z-50',
              variant === 'blur' && 'backdrop-blur-sm',
              variant === 'pulse' && animate && 'animate-pulse',
              'bg-white/80 dark:bg-gray-900/80'
            )}
          >
            <div className="p-4">
              {renderLoadingIndicator()}
            </div>
          </div>
        </FadeTransition>
        
        <span className="sr-only">
          {isLoading ? 'Loading content, please wait.' : 'Content loaded.'}
        </span>
      </div>
    );
  }
  
  // For other variants, render the indicator directly with fade transition
  return (
    <FadeTransition 
      in={Boolean(isLoading)} 
      enterDuration={transitionDuration}
      exitDuration={transitionDuration}
      enterDelay={delay}
      mountOnEnter={!children}
      unmountOnExit={!children}
    >
      <div 
        className={cn(
          'flex items-center justify-center',
          fullScreen && 'fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80',
          className
        )}
        {...ariaAttributes}
      >
        {renderLoadingIndicator()}
        
        <span className="sr-only">
          {isLoading ? 'Loading content, please wait.' : 'Content loaded.'}
        </span>
      </div>
    </FadeTransition>
  );
};

export default LoadingUI; 