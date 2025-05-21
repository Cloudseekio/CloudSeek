import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { 
  mockAnimationFrame, 
  simulateTransitionEnd,
  simulateAnimationEnd,
  mockIntersectionObserver,
  animationTestSetup
} from '../../testUtils/animationMocks';

// Simple animated component for testing
const FadeInComponent = ({ 
  isVisible = false, 
  onTransitionEnd = () => {},
  testId = 'fade-element'
}) => {
  const [show, setShow] = React.useState(isVisible);
  
  React.useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);
  
  return (
    <div>
      <button 
        onClick={() => setShow(prev => !prev)}
        data-testid="toggle-button"
      >
        Toggle
      </button>
      <div 
        data-testid={testId}
        className={`fade-element ${show ? 'visible' : 'hidden'}`}
        style={{
          opacity: show ? 1 : 0,
          transition: 'opacity 300ms ease-in-out',
        }}
        onTransitionEnd={onTransitionEnd}
      >
        Fade Content
      </div>
    </div>
  );
};

// Component that uses requestAnimationFrame for animation
const AnimatedCounter = ({ 
  initialValue = 0, 
  targetValue = 100,
  duration = 1000,
  testId = 'counter'
}) => {
  const [value, setValue] = React.useState(initialValue);
  const startTimeRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);
  
  // Cleanup function to ensure we don't have memory leaks
  const cleanup = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };
  
  React.useEffect(() => {
    // Reset the start time when props change
    startTimeRef.current = null;
    
    // Define the animation function
    const animate = (timestamp: number) => {
      // Initialize the start time on first frame
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      
      // Calculate elapsed time and animation progress
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Calculate the current value based on progress
      const currentValue = initialValue + (targetValue - initialValue) * progress;
      setValue(Math.round(currentValue));
      
      // Continue animation if not complete
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Animation is complete, ensure we hit the exact target value
        setValue(targetValue);
        rafRef.current = null;
      }
    };
    
    // Start the animation
    rafRef.current = requestAnimationFrame(animate);
    
    // Clean up when component unmounts or props change
    return cleanup;
  }, [initialValue, targetValue, duration]);
  
  return <div data-testid={testId}>{value}</div>;
};

// Component that appears when scrolled into view
const LazyLoadedComponent = ({ onAppear = () => {} }) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  
  React.useEffect(() => {
    if (!elementRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
      
      if (entry.isIntersecting) {
        onAppear();
        observer.disconnect();
      }
    });
    
    observer.observe(elementRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [onAppear]);
  
  return (
    <div 
      ref={elementRef}
      className={`lazy-element ${isVisible ? 'visible' : 'hidden'}`}
      data-testid="lazy-element"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 500ms ease, transform 500ms ease'
      }}
    >
      Lazy Loaded Content
    </div>
  );
};

// Component with CSS animation
const PulseComponent = ({ 
  isAnimating = false, 
  onAnimationEnd = () => {},
  testId = 'pulse-element'
}) => {
  const [animate, setAnimate] = React.useState(isAnimating);
  
  React.useEffect(() => {
    setAnimate(isAnimating);
  }, [isAnimating]);
  
  return (
    <div>
      <button 
        onClick={() => setAnimate(prev => !prev)}
        data-testid="animation-toggle"
      >
        Toggle Animation
      </button>
      <div 
        data-testid={testId}
        className={`pulse-element ${animate ? 'animate-pulse' : ''}`}
        style={{ 
          width: '100px', 
          height: '100px', 
          backgroundColor: 'blue',
          animation: animate ? 'pulse 2s infinite' : 'none'
        }}
        onAnimationEnd={onAnimationEnd}
      >
        Pulse Animation
      </div>
    </div>
  );
};

describe('Animation Testing Examples', () => {
  // Use our animation test setup for all tests
  beforeEach(() => {
    animationTestSetup.beforeEach();
  });

  afterEach(() => {
    animationTestSetup.afterEach();
  });

  describe('CSS Transition Tests', () => {
    it('should toggle visibility when button is clicked', async () => {
      // Use the user-event setup 
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      
      render(<FadeInComponent />);
      
      // Initial state
      expect(screen.getByTestId('fade-element')).toHaveClass('hidden');
      expect(screen.getByTestId('fade-element')).toHaveStyle({ opacity: 0 });
      
      // Click toggle button
      await user.click(screen.getByTestId('toggle-button'));
      
      // Element should now be visible
      expect(screen.getByTestId('fade-element')).toHaveClass('visible');
      expect(screen.getByTestId('fade-element')).toHaveStyle({ opacity: 1 });
    });
    
    it('should call onTransitionEnd when transition completes', async () => {
      const onTransitionEnd = jest.fn();
      
      // Use the user-event setup
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      
      render(<FadeInComponent onTransitionEnd={onTransitionEnd} />);
      
      // Click toggle button to start transition
      await user.click(screen.getByTestId('toggle-button'));
      
      // Simulate the transition end event
      simulateTransitionEnd(screen.getByTestId('fade-element'), 'opacity');
      
      // Check that callback was called
      expect(onTransitionEnd).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('requestAnimationFrame Tests', () => {
    // We'll need to manage this cleanup in each test
    let cleanupAnimationFrameMock: (() => void) | undefined;
    
    beforeEach(() => {
      cleanupAnimationFrameMock = mockAnimationFrame();
    });
    
    afterEach(() => {
      if (cleanupAnimationFrameMock) {
        cleanupAnimationFrameMock();
      }
    });
    
    it('should animate counter from initial to target value', () => {
      // Create a new implementation for the mockAnimationFrame
      const cleanupMock = mockAnimationFrame();
      
      // Mock performance.now to control timing
      const originalPerformanceNow = performance.now;
      let mockTime = 0;
      performance.now = jest.fn(() => mockTime);
      
      try {
        render(<AnimatedCounter initialValue={0} targetValue={100} duration={500} />);
        
        // Initial render, trigger first animation frame
        act(() => {
          // First frame at time 0
          if (window.__triggerAnimationFrame) {
            window.__triggerAnimationFrame(0);
          }
        });
        
        // Initial value should be 0
        expect(screen.getByTestId('counter')).toHaveTextContent('0');
        
        // Middle of animation (250ms)
        act(() => {
          mockTime = 250; // Middle of animation duration
          if (window.__triggerAnimationFrame) {
            window.__triggerAnimationFrame(mockTime);
          }
        });
        
        // Value should be around 50 (middle of animation)
        const midValue = parseInt(screen.getByTestId('counter').textContent || '0', 10);
        expect(midValue).toBeGreaterThan(40);
        expect(midValue).toBeLessThan(60);
        
        // End of animation (500ms)
        act(() => {
          mockTime = 500; // End of animation
          if (window.__triggerAnimationFrame) {
            window.__triggerAnimationFrame(mockTime);
          }
        });
        
        // Final value should be 100
        expect(screen.getByTestId('counter')).toHaveTextContent('100');
      } finally {
        // Clean up mocks
        performance.now = originalPerformanceNow;
        cleanupMock();
      }
    });
    
    it('should stop animation on unmount', () => {
      const { unmount } = render(<AnimatedCounter />);
      
      // Spy on cancelAnimationFrame
      const cancelSpy = jest.spyOn(window, 'cancelAnimationFrame');
      
      // Unmount the component
      unmount();
      
      // Should have called cancelAnimationFrame
      expect(cancelSpy).toHaveBeenCalled();
    });
  });
  
  describe('IntersectionObserver Tests', () => {
    it('should show element when it intersects the viewport', () => {
      // Create our mock observer
      const observerMock = mockIntersectionObserver();
      const onAppear = jest.fn();
      
      render(<LazyLoadedComponent onAppear={onAppear} />);
      
      // Get the element
      const lazyElement = screen.getByTestId('lazy-element');
      
      // Initially not visible
      expect(lazyElement).toHaveClass('hidden');
      
      // Use observer instance to simulate intersection
      const mockIntersectionObserverInstance = observerMock.mock.mock.results[0].value;
      
      // Simulate intersection
      act(() => {
        mockIntersectionObserverInstance.simulateIntersection(true, lazyElement);
      });
      
      // Element should now be visible
      expect(lazyElement).toHaveClass('visible');
      expect(lazyElement).toHaveStyle({ 
        opacity: 1,
        transform: 'translateY(0)'
      });
      
      // Callback should have been called
      expect(onAppear).toHaveBeenCalledTimes(1);
      
      // Clean up our mock
      observerMock.cleanup();
    });
  });
  
  describe('CSS Animation Tests', () => {
    it('should toggle animation class when button is clicked', async () => {
      // Use the user-event setup
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      
      render(<PulseComponent />);
      
      // Initial state - no animation
      expect(screen.getByTestId('pulse-element')).not.toHaveClass('animate-pulse');
      
      // Click toggle button
      await user.click(screen.getByTestId('animation-toggle'));
      
      // Animation should be active
      expect(screen.getByTestId('pulse-element')).toHaveClass('animate-pulse');
    });
    
    it('should call onAnimationEnd when animation completes', async () => {
      const onAnimationEnd = jest.fn();
      
      // Use the user-event setup
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      
      render(<PulseComponent onAnimationEnd={onAnimationEnd} />);
      
      // Click toggle button to start animation
      await user.click(screen.getByTestId('animation-toggle'));
      
      // Simulate the animation end event
      simulateAnimationEnd(screen.getByTestId('pulse-element'), 'pulse');
      
      // Check that callback was called
      expect(onAnimationEnd).toHaveBeenCalledTimes(1);
    });
  });
}); 