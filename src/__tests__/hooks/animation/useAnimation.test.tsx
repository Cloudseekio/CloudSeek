import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useAnimation } from '../../../hooks/animation/useAnimation';
import { animationTestSetup, simulateAnimationEnd } from '../../../testUtils/animationMocks';

describe('useAnimation hook', () => {
  // Set up animation testing utilities
  beforeEach(() => {
    animationTestSetup.beforeEach();
  });

  afterEach(() => {
    animationTestSetup.afterEach();
  });

  // Test component using the hook
  const TestComponent: React.FC<{
    duration?: number;
    delay?: number;
    easing?: string;
    iterations?: number | 'infinite';
    alternate?: boolean;
    fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
    initialPlayState?: 'running' | 'paused' | 'idle';
    onStart?: () => void;
    onComplete?: () => void;
    onIteration?: () => void;
    autoPlay?: boolean;
  }> = ({
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
    autoPlay = true
  }) => {
    const { 
      playState, 
      play, 
      pause, 
      cancel, 
      reset, 
      toggle, 
      ref, 
      getAnimationStyles 
    } = useAnimation({
      duration,
      delay,
      easing,
      iterations,
      alternate,
      fillMode,
      initialPlayState,
      onStart,
      onComplete,
      onIteration,
      autoPlay
    });

    // Create styles for test animation
    const animationStyles = getAnimationStyles('testAnim');

    return (
      <div 
        data-testid="animated-element" 
        ref={ref as React.RefObject<HTMLDivElement>} 
        style={animationStyles}
      >
        <div data-testid="play-state">{playState}</div>
        <button data-testid="play-btn" onClick={play}>Play</button>
        <button data-testid="pause-btn" onClick={pause}>Pause</button>
        <button data-testid="cancel-btn" onClick={cancel}>Cancel</button>
        <button data-testid="reset-btn" onClick={reset}>Reset</button>
        <button data-testid="toggle-btn" onClick={toggle}>Toggle</button>
      </div>
    );
  };

  it('initializes with the correct play state based on autoPlay', () => {
    // With autoPlay=true (default)
    const { rerender } = render(<TestComponent />);
    expect(screen.getByTestId('play-state')).toHaveTextContent('running');

    // With autoPlay=false
    rerender(<TestComponent autoPlay={false} />);
    expect(screen.getByTestId('play-state')).toHaveTextContent('idle');
  });

  it('applies animation styles correctly', () => {
    render(
      <TestComponent 
        duration={2000} 
        delay={500} 
        easing="ease-in-out" 
        iterations={2} 
        alternate={true} 
        fillMode="both" 
      />
    );
    
    const animatedEl = screen.getByTestId('animated-element');
    
    // Check that CSS animation properties are correctly applied
    expect(animatedEl).toHaveStyle({
      animationDuration: '2000ms',
      animationDelay: '500ms',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: '2',
      animationDirection: 'alternate',
      animationFillMode: 'both'
    });
  });

  it('changes play state when play/pause/cancel methods are called', () => {
    render(<TestComponent autoPlay={false} />);
    
    // Initial state
    expect(screen.getByTestId('play-state')).toHaveTextContent('idle');
    
    // Play
    act(() => {
      screen.getByTestId('play-btn').click();
    });
    expect(screen.getByTestId('play-state')).toHaveTextContent('running');
    
    // Pause
    act(() => {
      screen.getByTestId('pause-btn').click();
    });
    expect(screen.getByTestId('play-state')).toHaveTextContent('paused');
    
    // Play again
    act(() => {
      screen.getByTestId('play-btn').click();
    });
    expect(screen.getByTestId('play-state')).toHaveTextContent('running');
    
    // Cancel
    act(() => {
      screen.getByTestId('cancel-btn').click();
    });
    expect(screen.getByTestId('play-state')).toHaveTextContent('idle');
  });

  it('toggles between play and pause states', () => {
    render(<TestComponent />);
    
    // Initial state (running because autoPlay=true)
    expect(screen.getByTestId('play-state')).toHaveTextContent('running');
    
    // Toggle to paused
    act(() => {
      screen.getByTestId('toggle-btn').click();
    });
    expect(screen.getByTestId('play-state')).toHaveTextContent('paused');
    
    // Toggle back to running
    act(() => {
      screen.getByTestId('toggle-btn').click();
    });
    expect(screen.getByTestId('play-state')).toHaveTextContent('running');
  });

  it('calls callbacks at the right time', () => {
    const onStart = jest.fn();
    const onComplete = jest.fn();
    const onIteration = jest.fn();
    
    render(
      <TestComponent
        duration={500}
        iterations={2}
        onStart={onStart}
        onComplete={onComplete}
        onIteration={onIteration}
        autoPlay={true}
      />
    );
    
    const animatedEl = screen.getByTestId('animated-element');
    
    // onStart should be called when animation starts (which happens immediately with autoPlay=true)
    expect(onStart).toHaveBeenCalled();
    
    // Simulate end of first iteration
    act(() => {
      // Check if simulateAnimationEnd accepts the isIteration parameter
      try {
        // @ts-ignore - Ignore the type error for the third parameter
        simulateAnimationEnd(animatedEl, 'testAnim', true);
      } catch {
        // Fallback to the standard signature if the extended one is not supported
        simulateAnimationEnd(animatedEl, 'testAnim');
      }
    });
    
    // onIteration should be called
    expect(onIteration).toHaveBeenCalled();
    
    // Simulate end of animation
    act(() => {
      simulateAnimationEnd(animatedEl, 'testAnim');
    });
    
    // onComplete should be called
    expect(onComplete).toHaveBeenCalled();
    
    // After animation completes, state should be 'finished'
    expect(screen.getByTestId('play-state')).toHaveTextContent('finished');
  });

  it('resets the animation state', () => {
    render(<TestComponent duration={500} />);
    
    // Initial state (running due to autoPlay)
    expect(screen.getByTestId('play-state')).toHaveTextContent('running');
    
    // Simulate animation end
    act(() => {
      simulateAnimationEnd(screen.getByTestId('animated-element'), 'testAnim');
    });
    
    // Should be 'finished'
    expect(screen.getByTestId('play-state')).toHaveTextContent('finished');
    
    // Reset animation
    act(() => {
      screen.getByTestId('reset-btn').click();
    });
    
    // Should be back to 'idle'
    expect(screen.getByTestId('play-state')).toHaveTextContent('idle');
  });

  it('handles infinite iterations correctly', () => {
    render(<TestComponent iterations="infinite" />);
    
    const animatedEl = screen.getByTestId('animated-element');
    
    // Check that CSS animation properties are correctly applied
    expect(animatedEl).toHaveStyle({
      animationIterationCount: 'infinite'
    });
  });
}); 