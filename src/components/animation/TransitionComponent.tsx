import React, { useState, useEffect, forwardRef, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type TransitionStatus = 'entering' | 'entered' | 'exiting' | 'exited';

export interface TransitionProps {
  /** Whether the component should be visible */
  in: boolean;
  /** Component or element to render */
  children: ReactNode | ((status: TransitionStatus) => ReactNode);
  /** Duration of the enter transition in milliseconds */
  enterDuration?: number;
  /** Duration of the exit transition in milliseconds */
  exitDuration?: number;
  /** Optional delay before starting enter transition */
  enterDelay?: number;
  /** Optional delay before starting exit transition */
  exitDelay?: number;
  /** CSS class to apply during transitions */
  transitionClassName?: string;
  /** Additional CSS classes */
  className?: string;
  /** Called when enter transition starts */
  onEnter?: () => void;
  /** Called when enter transition is done */
  onEntered?: () => void;
  /** Called when exit transition starts */
  onExit?: () => void;
  /** Called when exit transition is done */
  onExited?: () => void;
  /** Keep component mounted even when not visible */
  mountOnEnter?: boolean;
  /** Unmount component when not visible */
  unmountOnExit?: boolean;
  /** Disable all transitions */
  disabled?: boolean;
  /** Optional style overrides */
  style?: React.CSSProperties;
}

/**
 * TransitionComponent - Base component for creating animated transitions
 * 
 * This component manages the lifecycle of transitions with proper timing
 * and status tracking. It can be used directly or as a base for more
 * specialized animation components.
 */
export const TransitionComponent = forwardRef<HTMLDivElement, TransitionProps>(
  (
    {
      in: inProp,
      children,
      enterDuration = 300,
      exitDuration = 300,
      enterDelay = 0,
      exitDelay = 0,
      transitionClassName = '',
      className = '',
      onEnter,
      onEntered,
      onExit,
      onExited,
      mountOnEnter = false,
      unmountOnExit = false,
      disabled = false,
      style,
      ...rest
    },
    ref
  ) => {
    const [status, setStatus] = useState<TransitionStatus>(
      inProp ? (mountOnEnter ? 'exited' : 'entered') : 'exited'
    );
    
    useEffect(() => {
      if (disabled) return;
      
      let timerId: NodeJS.Timeout;
      
      // Handle entering status
      if (inProp) {
        if (status === 'exited' || status === 'exiting') {
          clearTimeout(timerId);
          
          if (status !== 'entering') {
            setStatus('entering');
            onEnter?.();
            
            timerId = setTimeout(() => {
              setStatus('entered');
              onEntered?.();
            }, enterDuration + enterDelay);
          }
        }
      } 
      // Handle exiting status
      else if (status === 'entering' || status === 'entered') {
        clearTimeout(timerId);
        
        if (status !== 'exiting') {
          setStatus('exiting');
          onExit?.();
          
          timerId = setTimeout(() => {
            setStatus('exited');
            onExited?.();
          }, exitDuration + exitDelay);
        }
      }
      
      return () => {
        clearTimeout(timerId);
      };
    }, [
      inProp, 
      status, 
      disabled, 
      enterDuration, 
      exitDuration, 
      enterDelay, 
      exitDelay, 
      onEnter, 
      onEntered, 
      onExit, 
      onExited
    ]);
    
    // Don't render component at all if it's initially not visible and mountOnEnter is true
    if (status === 'exited' && !inProp && unmountOnExit) {
      return null;
    }
    
    // Handle both children as a function or as a normal React node
    const renderChildren = () => {
      if (typeof children === 'function') {
        return children(status);
      }
      return children;
    };
    
    // Generate dynamic styles for transitions
    const transitionStyles: React.CSSProperties = disabled
      ? {}
      : {
          ...getStatusStyles(status, enterDuration, exitDuration, enterDelay, exitDelay),
          ...style
        };
    
    return (
      <div
        ref={ref}
        className={cn(
          'transition-component',
          status === 'entering' && 'transition-entering',
          status === 'entered' && 'transition-entered',
          status === 'exiting' && 'transition-exiting',
          status === 'exited' && 'transition-exited',
          transitionClassName,
          className
        )}
        style={transitionStyles}
        data-status={status}
        {...rest}
      >
        {renderChildren()}
      </div>
    );
  }
);

TransitionComponent.displayName = 'TransitionComponent';

// Helper to generate the appropriate styles based on transition status
function getStatusStyles(
  status: TransitionStatus,
  enterDuration: number,
  exitDuration: number,
  enterDelay: number,
  exitDelay: number
): React.CSSProperties {
  switch (status) {
    case 'entering':
      return {
        transition: `all ${enterDuration}ms ease-in-out ${enterDelay}ms`,
      };
    case 'entered':
      return {
        transition: '',
      };
    case 'exiting':
      return {
        transition: `all ${exitDuration}ms ease-in-out ${exitDelay}ms`,
      };
    case 'exited':
      return {
        transition: '',
      };
    default:
      return {};
  }
}

export default TransitionComponent; 