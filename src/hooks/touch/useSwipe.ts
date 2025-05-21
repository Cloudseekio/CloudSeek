import { useRef, useState, useEffect, useCallback } from 'react';

export type SwipeDirection = 'up' | 'down' | 'left' | 'right' | null;

export interface SwipeOptions {
  /** Minimum distance in pixels to trigger swipe */
  threshold?: number;
  /** Minimum velocity in pixels/ms to trigger swipe */
  velocityThreshold?: number;
  /** When to attach listeners (default: 'auto') */
  detectMode?: 'auto' | 'touch' | 'mouse' | 'all';
  /** Callback when swipe begins */
  onSwipeStart?: (position: { x: number; y: number }) => void;
  /** Callback during swipe */
  onSwiping?: (position: { x: number; y: number; deltaX: number; deltaY: number; direction: SwipeDirection }) => void;
  /** Callback for swipe end when it did not meet threshold */
  onSwipeCancel?: () => void;
  /** Element to attach the listeners to (default: element from ref) */
  target?: HTMLElement | null | 'document';
  /** Disable horizontal detection */
  disableHorizontal?: boolean;
  /** Disable vertical detection */
  disableVertical?: boolean;
}

export interface SwipeState {
  /** Current swipe direction */
  direction: SwipeDirection;
  /** Whether swipe is in progress */
  swiping: boolean;
  /** Horizontal distance of swipe */
  deltaX: number;
  /** Vertical distance of swipe */
  deltaY: number;
  /** Start position of swipe */
  start: { x: number; y: number } | null;
  /** Current position of swipe */
  current: { x: number; y: number } | null;
  /** Swipe velocity in pixels/ms */
  velocity: number;
}

interface SwipeHandlers {
  ref: React.RefObject<HTMLElement | null>;
}

/**
 * Hook for detecting swipe gestures on touch-enabled devices
 */
export function useSwipe(options: SwipeOptions = {}): [SwipeState, SwipeHandlers] {
  const {
    threshold = 50,
    velocityThreshold = 0.2,
    detectMode = 'auto',
    onSwipeStart,
    onSwiping,
    onSwipeCancel,
    target = null,
    disableHorizontal = false,
    disableVertical = false,
  } = options;

  const ref = useRef<HTMLElement>(null);
  
  // Track initial touch/click point and time
  const startPosition = useRef<{ x: number; y: number; time: number } | null>(null);
  const currentPosition = useRef<{ x: number; y: number } | null>(null);
  
  // Swipe state
  const [state, setState] = useState<SwipeState>({
    direction: null,
    swiping: false,
    deltaX: 0,
    deltaY: 0,
    start: null,
    current: null,
    velocity: 0,
  });

  // Get current target element
  const getTarget = useCallback(() => {
    if (target === 'document') return document;
    if (target) return target;
    return ref.current;
  }, [target]);

  // Should we use mouse or touch events?
  const [useMouseEvents, setUseMouseEvents] = useState(() => {
    if (detectMode === 'touch') return false;
    if (detectMode === 'mouse') return true;
    if (detectMode === 'all') return true;
    
    // In auto mode, check if touch is available
    if (typeof window !== 'undefined') {
      return !('ontouchstart' in window);
    }
    return false;
  });

  // Handle pointer/touch start
  const handleStart = useCallback(
    (e: TouchEvent | MouseEvent) => {
      const position = getPosition(e);
      if (!position) return;

      const { clientX, clientY } = position;
      startPosition.current = { x: clientX, y: clientY, time: Date.now() };
      currentPosition.current = { x: clientX, y: clientY };
      
      setState(prev => ({
        ...prev,
        start: { x: clientX, y: clientY },
        current: { x: clientX, y: clientY },
        deltaX: 0,
        deltaY: 0,
        direction: null,
        swiping: true,
        velocity: 0,
      }));
      
      onSwipeStart?.({ x: clientX, y: clientY });
    },
    [onSwipeStart]
  );

  // Handle pointer/touch move
  const handleMove = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (!startPosition.current || !currentPosition.current) return;
      
      const position = getPosition(e);
      if (!position) return;
      
      const { clientX, clientY } = position;
      const deltaX = clientX - startPosition.current.x;
      const deltaY = clientY - startPosition.current.y;
      
      currentPosition.current = { x: clientX, y: clientY };
      
      // Determine swipe direction
      let direction: SwipeDirection = null;
      
      if (!disableHorizontal && Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else if (!disableVertical && Math.abs(deltaY) > Math.abs(deltaX)) {
        direction = deltaY > 0 ? 'down' : 'up';
      }
      
      // Calculate velocity
      const timeDelta = Date.now() - startPosition.current.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = distance / (timeDelta || 1); // Avoid division by zero
      
      setState(prev => ({
        ...prev,
        current: { x: clientX, y: clientY },
        deltaX,
        deltaY,
        direction,
        velocity,
      }));
      
      onSwiping?.({
        x: clientX,
        y: clientY,
        deltaX,
        deltaY,
        direction,
      });
    },
    [disableHorizontal, disableVertical, onSwiping]
  );

  // Handle pointer/touch end
  const handleEnd = useCallback(
    () => {
      if (!startPosition.current || !currentPosition.current) return;
      
      const deltaX = currentPosition.current.x - startPosition.current.x;
      const deltaY = currentPosition.current.y - startPosition.current.y;
      const timeDelta = Date.now() - startPosition.current.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const velocity = distance / (timeDelta || 1);
      
      let direction: SwipeDirection = null;
      const minDistance = threshold;
      const minVelocity = velocityThreshold;
      
      // Check if swipe meets threshold requirements
      const isValidSwipe = distance >= minDistance || velocity >= minVelocity;
      
      if (isValidSwipe) {
        if (!disableHorizontal && Math.abs(deltaX) > Math.abs(deltaY)) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else if (!disableVertical && Math.abs(deltaY) > Math.abs(deltaX)) {
          direction = deltaY > 0 ? 'down' : 'up';
        }
      } else {
        onSwipeCancel?.();
      }
      
      setState(prev => ({
        ...prev,
        swiping: false,
        direction,
        velocity,
      }));
      
      startPosition.current = null;
      currentPosition.current = null;
    },
    [threshold, velocityThreshold, disableHorizontal, disableVertical, onSwipeCancel]
  );

  // Handle window resize (to reset state if needed)
  const handleCancel = useCallback(() => {
    startPosition.current = null;
    currentPosition.current = null;
    
    setState({
      direction: null,
      swiping: false,
      deltaX: 0,
      deltaY: 0,
      start: null,
      current: null,
      velocity: 0,
    });
    
    onSwipeCancel?.();
  }, [onSwipeCancel]);

  // Set up event listeners
  useEffect(() => {
    const targetElement = getTarget();
    if (!targetElement) return undefined;
    
    // Auto-detect if we should use mouse or touch events
    const detectTouchSupport = () => {
      if (detectMode !== 'auto') return;
      
      // Check if the device supports touch events
      if (typeof window !== 'undefined') {
        const hasTouchSupport = 'ontouchstart' in window;
        setUseMouseEvents(!hasTouchSupport);
      }
    };
    
    detectTouchSupport();
    
    // Register touch events
    if (!useMouseEvents) {
      targetElement.addEventListener('touchstart', handleStart as EventListener);
      document.addEventListener('touchmove', handleMove as EventListener, { passive: false });
      document.addEventListener('touchend', handleEnd as EventListener);
      document.addEventListener('touchcancel', handleCancel);
    }
    
    // Register mouse events
    if (useMouseEvents) {
      targetElement.addEventListener('mousedown', handleStart as EventListener);
      document.addEventListener('mousemove', handleMove as EventListener);
      document.addEventListener('mouseup', handleEnd as EventListener);
      document.addEventListener('mouseleave', handleCancel);
    }
    
    // Handle window resize to cancel swipe
    window.addEventListener('resize', handleCancel);
    
    return () => {
      // Clean up touch events
      if (!useMouseEvents) {
        targetElement.removeEventListener('touchstart', handleStart as EventListener);
        document.removeEventListener('touchmove', handleMove as EventListener);
        document.removeEventListener('touchend', handleEnd as EventListener);
        document.removeEventListener('touchcancel', handleCancel);
      }
      
      // Clean up mouse events
      if (useMouseEvents) {
        targetElement.removeEventListener('mousedown', handleStart as EventListener);
        document.removeEventListener('mousemove', handleMove as EventListener);
        document.removeEventListener('mouseup', handleEnd as EventListener);
        document.removeEventListener('mouseleave', handleCancel);
      }
      
      window.removeEventListener('resize', handleCancel);
    };
  }, [handleStart, handleMove, handleEnd, handleCancel, useMouseEvents, detectMode, getTarget]);

  return [state, { ref }];
}

// Utility to extract position from event
function getPosition(e: TouchEvent | MouseEvent) {
  if ('touches' in e) {
    const touch = e.touches[0] || e.changedTouches[0];
    return touch;
  }
  
  return e;
} 