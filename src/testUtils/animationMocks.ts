/**
 * Animation Testing Utilities
 * 
 * This file contains reusable mocks and helpers for testing components with animations.
 */

import { act } from '@testing-library/react';

// Augment the Window interface to include our custom methods
declare global {
  interface Window {
    __triggerAnimationFrame?: (timestamp?: number) => number;
  }
}

/**
 * Setup mocks for requestAnimationFrame and cancelAnimationFrame
 * Returns cleanup function to restore original implementations
 */
export function mockAnimationFrame() {
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;
  
  // Keep track of callbacks that have been registered but not yet executed
  const callbacks: Map<number, FrameRequestCallback> = new Map();
  let lastCallbackId = 0;
  
  const mockRequestAnimationFrame = jest.fn((callback: FrameRequestCallback): number => {
    const callbackId = ++lastCallbackId;
    callbacks.set(callbackId, callback);
    return callbackId;
  });
  
  const mockCancelAnimationFrame = jest.fn((handle: number): void => {
    callbacks.delete(handle);
  });
  
  // Mock implementations
  window.requestAnimationFrame = mockRequestAnimationFrame;
  window.cancelAnimationFrame = mockCancelAnimationFrame;
  
  // Add a helper function to the window object to trigger animation frames
  window.__triggerAnimationFrame = (timestamp = performance.now()) => {
    // Take a snapshot of the callbacks to avoid issues with callbacks registering new callbacks
    const callbacksToRun = Array.from(callbacks.entries());
    
    // Clear the callbacks map before running them
    callbacks.clear();
    
    // Run each callback
    callbacksToRun.forEach(([, callback]) => {
      // The callback might register a new callback, which would be added to the map
      callback(timestamp);
    });
    
    return callbacksToRun.length;
  };
  
  return () => {
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
    window.__triggerAnimationFrame = undefined;
    jest.clearAllMocks();
  };
}

/**
 * Helper to advance multiple animation frames in tests
 * This now uses the new __triggerAnimationFrame helper from mockAnimationFrame
 */
export function advanceAnimationFrames(count: number): void {
  let framesLeft = count;
  let timestamp = performance.now();
  const timeIncrement = 16; // ~60fps
  
  while (framesLeft > 0) {
    timestamp += timeIncrement;
    act(() => {
      if (typeof window.__triggerAnimationFrame === 'function') {
        const callbacksRun = window.__triggerAnimationFrame(timestamp);
        // If no callbacks were run but we're still expecting to advance frames,
        // we'll just decrement the counter anyway
        if (callbacksRun === 0) {
          framesLeft--;
        } else {
          // If callbacks were run, we'll count one frame as processed
          framesLeft--;
        }
      } else {
        // If the triggerAnimationFrame function is not available, just decrement the counter
        console.warn('__triggerAnimationFrame is not available. Did you call mockAnimationFrame()?');
        framesLeft--;
      }
    });
  }
}

/**
 * Mock for the Web Animations API
 * Returns cleanup function to restore original implementation
 */
export function mockWebAnimationsApi() {
  const originalAnimate = Element.prototype.animate;
  
  // Mock Animation methods
  const mockAnimationPlay = jest.fn();
  const mockAnimationPause = jest.fn();
  const mockAnimationCancel = jest.fn();
  const mockAnimationFinish = jest.fn();
  
  class MockAnimation {
    currentTime = 0;
    startTime = 0;
    playbackRate = 1;
    playState = 'running';
    pending = false;
    
    // Events
    onfinish: (() => void) | null = null;
    
    constructor() {
      this.play = mockAnimationPlay;
      this.pause = mockAnimationPause;
      this.cancel = mockAnimationCancel;
      this.finish = mockAnimationFinish.mockImplementation(() => {
        this.currentTime = 1000; // End of animation
        this.playState = 'finished';
        if (this.onfinish) this.onfinish();
      });
    }
    
    // Necessary for TypeScript
    play() {}
    pause() {}
    cancel() {}
    finish() {}
  }
  
  // Override Element.animate
  const animateMock = jest.fn().mockImplementation(() => new MockAnimation());
  Element.prototype.animate = animateMock;
  
  return {
    cleanup: () => {
      Element.prototype.animate = originalAnimate;
      jest.restoreAllMocks();
    },
    methods: {
      play: mockAnimationPlay,
      pause: mockAnimationPause,
      cancel: mockAnimationCancel,
      finish: mockAnimationFinish
    },
    mock: animateMock
  };
}

/**
 * Type for IntersectionObserver mock
 */
interface MockIntersectionObserverInstance {
  observe: jest.Mock;
  unobserve: jest.Mock;
  disconnect: jest.Mock;
  simulateIntersection: (isIntersecting: boolean, target: Element) => void;
}

/**
 * Helper to create a mock IntersectionObserver
 */
export function mockIntersectionObserver() {
  const mockIntersectionObserver = jest.fn();
  
  mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback): MockIntersectionObserverInstance => {
    return {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
      // Helper to simulate intersection
      simulateIntersection: (isIntersecting: boolean, target: Element) => {
        callback([{
          isIntersecting,
          target,
          intersectionRatio: isIntersecting ? 1 : 0,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now()
        }], {} as IntersectionObserver);
      }
    };
  });
  
  const original = window.IntersectionObserver;
  window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;
  
  return {
    cleanup: () => {
      window.IntersectionObserver = original;
    },
    mock: mockIntersectionObserver
  };
}

/**
 * Setup and teardown for animation testing with fake timers
 * Use in beforeEach/afterEach
 */
export const animationTestSetup = {
  beforeEach: () => {
    jest.useFakeTimers();
  },
  
  afterEach: () => {
    jest.useRealTimers();
    jest.clearAllMocks();
  }
};

/**
 * Simulate a CSS transition end
 */
export function simulateTransitionEnd(element: Element, propertyName = 'opacity'): void {
  const event = new Event('transitionend', { bubbles: true });
  Object.defineProperty(event, 'propertyName', { value: propertyName });
  element.dispatchEvent(event);
}

/**
 * Simulate a CSS animation end
 */
export function simulateAnimationEnd(element: Element, animationName = 'fade'): void {
  const event = new Event('animationend', { bubbles: true });
  Object.defineProperty(event, 'animationName', { value: animationName });
  element.dispatchEvent(event);
}

/**
 * Create a helper to test staggered animations
 */
export function createStaggeredAnimationTester(staggerDelayMs = 100) {
  return {
    /**
     * Test if elements have properly staggered animation delays
     */
    testStaggeredElements: (elements: Element[]) => {
      elements.forEach((el, index) => {
        const expectedDelay = `${index * staggerDelayMs}ms`;
        expect(window.getComputedStyle(el).animationDelay).toBe(expectedDelay);
      });
    },
    
    /**
     * Test if elements reach their final state after their staggered delays
     */
    advanceTimers: (elements: Element[], testFn: (el: Element, index: number) => void) => {
      elements.forEach((el, index) => {
        // Advance to just after this element's delay
        act(() => {
          jest.advanceTimersByTime(index * staggerDelayMs + 10);
        });
        
        // Run the test function for this element
        testFn(el, index);
      });
    }
  };
}

/**
 * Type for PerformanceObserverCallback
 */
type PerformanceObserverCallback = (entries: { getEntries: () => PerformanceEntry[] }) => void;

/**
 * Mock PerformanceObserver for testing animation performance
 */
export function mockPerformanceObserver() {
  // Store original if it exists
  const originalPerformanceObserver = window.PerformanceObserver;
  
  class MockPerformanceObserver {
    private callback: PerformanceObserverCallback;
    
    constructor(callback: PerformanceObserverCallback) {
      this.callback = callback;
    }
    
    observe(): void {}
    disconnect(): void {}
    
    // Helper to simulate performance entries
    simulateEntry(entry: PerformanceEntry): void {
      this.callback({
        getEntries: () => [entry]
      });
    }
  }
  
  // Set mock - proper two-step type cast to avoid linter errors
  Object.defineProperty(window, 'PerformanceObserver', {
    value: MockPerformanceObserver,
    writable: true
  });
  
  return {
    cleanup: () => {
      window.PerformanceObserver = originalPerformanceObserver;
    }
  };
}

/**
 * Interface for mock ResizeObserver
 */
interface MockResizeObserverInstance {
  observe: jest.Mock;
  unobserve: jest.Mock;
  disconnect: jest.Mock;
  simulateResize: (target: Element, contentRect?: Partial<DOMRectReadOnly>) => void;
}

/**
 * Type for ResizeObserver callback
 */
type ResizeObserverCallback = (entries: ResizeObserverEntry[]) => void;

/**
 * Create a mock ResizeObserver
 */
export function mockResizeObserver() {
  const mockResizeObserver = jest.fn();
  
  mockResizeObserver.mockImplementation((callback: ResizeObserverCallback): MockResizeObserverInstance => {
    return {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
      // Helper to simulate resize
      simulateResize: (target: Element, contentRect: Partial<DOMRectReadOnly> = {}) => {
        callback([{
          target,
          contentRect: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            top: 0,
            right: 100,
            bottom: 100,
            left: 0,
            ...contentRect
          } as DOMRectReadOnly,
          borderBoxSize: [],
          contentBoxSize: [],
          devicePixelContentBoxSize: []
        }]);
      }
    };
  });
  
  const original = window.ResizeObserver;
  
  // Using the same pattern as PerformanceObserver to be consistent
  Object.defineProperty(window, 'ResizeObserver', {
    value: mockResizeObserver,
    writable: true
  });
  
  return {
    cleanup: () => {
      window.ResizeObserver = original;
    },
    mock: mockResizeObserver
  };
} 