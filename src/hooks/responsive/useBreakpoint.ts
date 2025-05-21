import { useState, useEffect } from 'react';

// Default breakpoints matching common device sizes
export const defaultBreakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

export type Breakpoint = keyof typeof defaultBreakpoints;
export type BreakpointValues = Record<Breakpoint, number>;

/**
 * A hook that returns the current breakpoint based on window width
 * @param customBreakpoints Optional custom breakpoints object
 * @returns The current breakpoint name
 */
export function useBreakpoint(customBreakpoints?: Partial<BreakpointValues>) {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };
  
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(() => {
    // Default to 'xs' during SSR
    if (typeof window === 'undefined') return 'xs';
    
    // Find the initial breakpoint
    return calculateBreakpoint(window.innerWidth, breakpoints);
  });
  
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    
    const handleResize = () => {
      const newBreakpoint = calculateBreakpoint(window.innerWidth, breakpoints);
      setCurrentBreakpoint(newBreakpoint);
    };
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoints]);
  
  return currentBreakpoint;
}

/**
 * A hook that returns whether the current viewport is at least a certain breakpoint
 * @param breakpoint The breakpoint to check against
 * @param customBreakpoints Optional custom breakpoints object
 * @returns Boolean indicating if current width is at least the specified breakpoint
 */
export function useBreakpointUp(breakpoint: Breakpoint, customBreakpoints?: Partial<BreakpointValues>) {
  const currentBreakpoint = useBreakpoint(customBreakpoints);
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };
  
  return breakpoints[currentBreakpoint] >= breakpoints[breakpoint];
}

/**
 * A hook that returns whether the current viewport is at most a certain breakpoint
 * @param breakpoint The breakpoint to check against
 * @param customBreakpoints Optional custom breakpoints object
 * @returns Boolean indicating if current width is at most the specified breakpoint
 */
export function useBreakpointDown(breakpoint: Breakpoint, customBreakpoints?: Partial<BreakpointValues>) {
  const currentBreakpoint = useBreakpoint(customBreakpoints);
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };
  
  return breakpoints[currentBreakpoint] <= breakpoints[breakpoint];
}

/**
 * A hook that returns whether the current viewport is between two breakpoints
 * @param start The lower breakpoint
 * @param end The upper breakpoint
 * @param customBreakpoints Optional custom breakpoints object
 * @returns Boolean indicating if current width is between the specified breakpoints
 */
export function useBreakpointBetween(
  start: Breakpoint,
  end: Breakpoint,
  customBreakpoints?: Partial<BreakpointValues>
) {
  const currentBreakpoint = useBreakpoint(customBreakpoints);
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };
  
  return (
    breakpoints[currentBreakpoint] >= breakpoints[start] &&
    breakpoints[currentBreakpoint] <= breakpoints[end]
  );
}

/**
 * Utility to calculate the current breakpoint based on window width
 */
function calculateBreakpoint(width: number, breakpoints: BreakpointValues): Breakpoint {
  // Sort breakpoints by value in descending order
  const sortedBreakpoints = Object.entries(breakpoints)
    .sort((a, b) => b[1] - a[1]) as [Breakpoint, number][];
  
  // Find the first breakpoint that's smaller than the current width
  for (const [name, minWidth] of sortedBreakpoints) {
    if (width >= minWidth) {
      return name;
    }
  }
  
  // Default to the smallest breakpoint if none match
  return 'xs';
} 