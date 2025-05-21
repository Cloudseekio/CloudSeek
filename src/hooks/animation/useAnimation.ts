import { useState, useRef, useEffect, useCallback } from 'react';

export interface AnimationConfig {
  /** Duration of the animation in milliseconds */
  duration?: number;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** Easing function name (for CSS) or cubic-bezier */
  easing?: string;
  /** Iterations (number or 'infinite') */
  iterations?: number | 'infinite';
  /** Whether to alternate direction */
  alternate?: boolean;
  /** Whether to fill forwards */
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  /** Initial animation play state */
  initialPlayState?: 'running' | 'paused' | 'idle';
  /** Called when animation starts */
  onStart?: () => void;
  /** Called when animation completes */
  onComplete?: () => void;
  /** Called on each animation iteration */
  onIteration?: () => void;
}

export interface UseAnimationOptions extends AnimationConfig {
  /** Whether to automatically start animation */
  autoPlay?: boolean;
}

export interface UseAnimationResult {
  /** Current animation play state */
  playState: 'idle' | 'running' | 'paused' | 'finished';
  /** Start the animation */
  play: () => void;
  /** Pause the animation */
  pause: () => void;
  /** Cancel and reset the animation */
  cancel: () => void;
  /** Reset the animation */
  reset: () => void;
  /** Toggle between playing and paused */
  toggle: () => void;
  /** Reference to target element for animation */
  ref: React.RefObject<HTMLElement | null>;
  /** Generate CSS animation style properties */
  getAnimationStyles: (animationName: string) => React.CSSProperties;
}

/**
 * Hook for controlling complex animations with fine-grained control
 * 
 * This hook provides an API for managing animations with control functions
 * and animation event callbacks. It can be used with CSS animations
 * or the Web Animations API.
 * 
 * @param options Configuration options for the animation
 * @returns Animation controls and element ref
 * 
 * @example
 * const { playState, play, pause, ref, getAnimationStyles } = useAnimation({
 *   duration: 1000,
 *   easing: 'ease-in-out',
 *   onComplete: () => console.log('Animation complete')
 * });
 * 
 * // In JSX
 * <div ref={ref} style={getAnimationStyles('fadeIn')}>
 *   Animated content
 * </div>
 */
export function useAnimation({
  duration = 1000,
  delay = 0,
  easing = 'ease',
  iterations = 1,
  alternate = false,
  fillMode = 'forwards',
  initialPlayState = 'running',
  onStart,
  onComplete,
  onIteration,
  autoPlay = true,
}: UseAnimationOptions = {}): UseAnimationResult {
  const ref = useRef<HTMLElement | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const [playState, setPlayState] = useState<'idle' | 'running' | 'paused' | 'finished'>(
    autoPlay ? 'running' : 'idle'
  );

  // Set up animation event listeners
  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const handleAnimationStart = () => {
      setPlayState('running');
      onStart?.();
    };

    const handleAnimationEnd = () => {
      setPlayState('finished');
      onComplete?.();
    };

    const handleAnimationIteration = () => {
      onIteration?.();
    };

    target.addEventListener('animationstart', handleAnimationStart);
    target.addEventListener('animationend', handleAnimationEnd);
    target.addEventListener('animationiteration', handleAnimationIteration);

    return () => {
      target.removeEventListener('animationstart', handleAnimationStart);
      target.removeEventListener('animationend', handleAnimationEnd);
      target.removeEventListener('animationiteration', handleAnimationIteration);
    };
  }, [onStart, onComplete, onIteration]);

  // Play animation
  const play = useCallback(() => {
    if (playState === 'running') return;

    if (animationRef.current) {
      animationRef.current.play();
    }

    setPlayState('running');
  }, [playState]);

  // Pause animation
  const pause = useCallback(() => {
    if (playState !== 'running') return;

    if (animationRef.current) {
      animationRef.current.pause();
    }

    setPlayState('paused');
  }, [playState]);

  // Cancel and reset animation
  const cancel = useCallback(() => {
    if (playState === 'idle') return;

    if (animationRef.current) {
      animationRef.current.cancel();
    }

    setPlayState('idle');
  }, [playState]);

  // Reset animation
  const reset = useCallback(() => {
    cancel();
    if (autoPlay) {
      setTimeout(play, 0);
    }
  }, [cancel, play, autoPlay]);

  // Toggle animation play state
  const toggle = useCallback(() => {
    if (playState === 'running') {
      pause();
    } else {
      play();
    }
  }, [playState, pause, play]);

  // Get animation styles for CSS animations
  const getAnimationStyles = useCallback(
    (animationName: string): React.CSSProperties => {
      return {
        animationName,
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationTimingFunction: easing,
        animationIterationCount: iterations === 'infinite' ? 'infinite' : iterations,
        animationDirection: alternate ? 'alternate' : 'normal',
        animationFillMode: fillMode,
        animationPlayState: playState === 'running' ? 'running' : 'paused',
      };
    },
    [duration, delay, easing, iterations, alternate, fillMode, playState]
  );

  // Use Web Animations API if available
  useEffect(() => {
    const element = ref.current;
    if (!element || !('animate' in element)) return;

    // Initial setup for web animations API
    if (initialPlayState !== 'idle' && autoPlay) {
      try {
        const animation = element.animate(
          [], // Will be filled in by consumer
          {
            duration,
            delay,
            easing,
            iterations: iterations === 'infinite' ? Infinity : iterations,
            direction: alternate ? 'alternate' : 'normal',
            fill: fillMode,
          }
        );

        animationRef.current = animation;

        animation.onfinish = () => {
          setPlayState('finished');
          onComplete?.();
        };

        if (initialPlayState === 'paused') {
          animation.pause();
          setPlayState('paused');
        } else {
          setPlayState('running');
        }
      } catch (error) {
        console.warn('Web Animations API not fully supported:', error);
      }
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, [duration, delay, easing, iterations, alternate, fillMode, initialPlayState, autoPlay, onComplete]);

  return {
    playState,
    play,
    pause,
    cancel,
    reset,
    toggle,
    ref,
    getAnimationStyles,
  };
}

export default useAnimation; 