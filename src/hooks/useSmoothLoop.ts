import { useRef, useState, useEffect, useCallback } from 'react';

interface SmoothLoopOptions {
  isPlaying: boolean;
  duration: number;
  easing?: (t: number) => number;
}

// Ease in-out cubic function for smoother acceleration and deceleration
const defaultEasing = (t: number): number => {
  return t < 0.5 
    ? 4 * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export function useSmoothLoop({ 
  isPlaying, 
  duration,
  easing = defaultEasing 
}: SmoothLoopOptions) {
  const [position, setPosition] = useState(0);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);
  
  // Function to handle the animation loop with smooth transitions
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
    }
    
    // Calculate elapsed time and adjust for frame rate
    const deltaTime = time - previousTimeRef.current;
    previousTimeRef.current = time;
    
    // Increment progress based on time and duration
    if (isPlaying) {
      progressRef.current += deltaTime / (duration * 1000);
      
      // Reset progress when it reaches 1
      if (progressRef.current >= 1) {
        progressRef.current = progressRef.current % 1;
      }
      
      // Apply easing to the progress for smoother movement
      const easedProgress = easing(progressRef.current);
      setPosition(easedProgress);
    }
    
    // Continue the loop
    requestRef.current = requestAnimationFrame(animate);
  }, [isPlaying, duration, easing]);
  
  // Start the animation loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
  
  // Reset animation when playback state changes
  useEffect(() => {
    if (!isPlaying) {
      previousTimeRef.current = null;
    }
  }, [isPlaying]);
  
  return position;
} 