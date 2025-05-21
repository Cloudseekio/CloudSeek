import { useState, useEffect, useCallback } from 'react';

export type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

export interface TransitionOptions {
  /** Initial transition state */
  initialState?: TransitionState;
  /** Enter transition duration in milliseconds */
  enterDuration?: number;
  /** Exit transition duration in milliseconds */
  exitDuration?: number;
  /** Delay before enter transition starts */
  enterDelay?: number;
  /** Delay before exit transition starts */
  exitDelay?: number;
  /** Called when enter transition starts */
  onEnter?: () => void;
  /** Called when enter transition completes */
  onEntered?: () => void;
  /** Called when exit transition starts */
  onExit?: () => void;
  /** Called when exit transition completes */
  onExited?: () => void;
}

/**
 * Hook for managing transition states in functional components
 * 
 * This hook provides a simple API for managing transitions with proper
 * timing and state management. It returns the current transition state
 * and functions to start and stop transitions.
 * 
 * @param options Configuration options for the transition
 * @returns Current state and control functions
 * 
 * @example
 * const { state, start, stop, toggle } = useTransition({
 *   enterDuration: 300,
 *   exitDuration: 200
 * });
 * 
 * // In JSX, apply CSS classes or styles based on state
 * <div className={`my-element ${state}`}>
 *   Content
 * </div>
 */
export function useTransition({
  initialState = 'exited',
  enterDuration = 300,
  exitDuration = 300,
  enterDelay = 0,
  exitDelay = 0,
  onEnter,
  onEntered,
  onExit,
  onExited
}: TransitionOptions = {}) {
  const [state, setState] = useState<TransitionState>(initialState);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Track timeouts to clean them up
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // Clear any pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);
  
  // Start a transition to entered state
  const start = useCallback(() => {
    if (state === 'entered' || state === 'entering') return;
    
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    
    setIsTransitioning(true);
    setState('entering');
    onEnter?.();
    
    const id = setTimeout(() => {
      setState('entered');
      setIsTransitioning(false);
      onEntered?.();
      setTimeoutId(null);
    }, enterDuration + enterDelay);
    
    setTimeoutId(id);
  }, [state, timeoutId, enterDuration, enterDelay, onEnter, onEntered]);
  
  // Start a transition to exited state
  const stop = useCallback(() => {
    if (state === 'exited' || state === 'exiting') return;
    
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    
    setIsTransitioning(true);
    setState('exiting');
    onExit?.();
    
    const id = setTimeout(() => {
      setState('exited');
      setIsTransitioning(false);
      onExited?.();
      setTimeoutId(null);
    }, exitDuration + exitDelay);
    
    setTimeoutId(id);
  }, [state, timeoutId, exitDuration, exitDelay, onExit, onExited]);
  
  // Toggle between entered and exited states
  const toggle = useCallback(() => {
    if (state === 'entering' || state === 'entered') {
      stop();
    } else {
      start();
    }
  }, [state, start, stop]);
  
  return {
    state,
    isTransitioning,
    start,
    stop,
    toggle,
    isVisible: state === 'entering' || state === 'entered'
  };
}

export default useTransition; 