import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useTransition, TransitionState } from '../../../hooks/animation/useTransition';
import { animationTestSetup } from '../../../testUtils/animationMocks';

describe('useTransition hook', () => {
  // Set up animation testing utilities
  beforeEach(() => {
    animationTestSetup.beforeEach();
  });

  afterEach(() => {
    animationTestSetup.afterEach();
  });

  // Test component using the hook
  const TestComponent: React.FC<{
    initialState?: TransitionState;
    enterDuration?: number;
    exitDuration?: number;
    enterDelay?: number;
    exitDelay?: number;
    onEnter?: () => void;
    onEntered?: () => void;
    onExit?: () => void;
    onExited?: () => void;
    startVisible?: boolean;
  }> = ({
    initialState = 'exited',
    enterDuration = 300,
    exitDuration = 300,
    enterDelay = 0,
    exitDelay = 0,
    onEnter = () => {},
    onEntered = () => {},
    onExit = () => {},
    onExited = () => {},
    startVisible = false
  }) => {
    const { state, start, stop, toggle } = useTransition({
      initialState,
      enterDuration,
      exitDuration,
      enterDelay,
      exitDelay,
      onEnter,
      onEntered,
      onExit,
      onExited
    });

    // Start the transition if startVisible is true (on mount)
    React.useEffect(() => {
      if (startVisible) {
        start();
      }
    }, [start, startVisible]);

    return (
      <div data-testid="test-component">
        <div data-testid="state">{state}</div>
        <button data-testid="start-btn" onClick={start}>Start</button>
        <button data-testid="stop-btn" onClick={stop}>Stop</button>
        <button data-testid="toggle-btn" onClick={toggle}>Toggle</button>
      </div>
    );
  };

  it('initializes with the correct state', () => {
    render(<TestComponent initialState="exited" />);
    expect(screen.getByTestId('state')).toHaveTextContent('exited');
  });

  it('transitions from exited to entering to entered when start is called', () => {
    render(<TestComponent initialState="exited" enterDuration={300} />);
    
    // Click start button
    act(() => {
      screen.getByTestId('start-btn').click();
    });
    
    // Should immediately change to entering
    expect(screen.getByTestId('state')).toHaveTextContent('entering');
    
    // After enterDuration, should be entered
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(screen.getByTestId('state')).toHaveTextContent('entered');
  });

  it('transitions from entered to exiting to exited when stop is called', () => {
    render(<TestComponent initialState="entered" exitDuration={300} />);
    
    // Click stop button
    act(() => {
      screen.getByTestId('stop-btn').click();
    });
    
    // Should immediately change to exiting
    expect(screen.getByTestId('state')).toHaveTextContent('exiting');
    
    // After exitDuration, should be exited
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(screen.getByTestId('state')).toHaveTextContent('exited');
  });

  it('toggles correctly between states', () => {
    render(<TestComponent initialState="exited" enterDuration={300} exitDuration={300} />);
    
    // Click toggle button (should enter)
    act(() => {
      screen.getByTestId('toggle-btn').click();
    });
    
    expect(screen.getByTestId('state')).toHaveTextContent('entering');
    
    // After enterDuration, should be entered
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(screen.getByTestId('state')).toHaveTextContent('entered');
    
    // Click toggle button again (should exit)
    act(() => {
      screen.getByTestId('toggle-btn').click();
    });
    
    expect(screen.getByTestId('state')).toHaveTextContent('exiting');
    
    // After exitDuration, should be exited
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(screen.getByTestId('state')).toHaveTextContent('exited');
  });

  it('respects enter and exit delays', () => {
    render(<TestComponent 
      initialState="exited" 
      enterDuration={300} 
      exitDuration={300}
      enterDelay={100}
      exitDelay={200}
    />);
    
    // Click start button
    act(() => {
      screen.getByTestId('start-btn').click();
    });
    
    // Should still be in exited state during enterDelay
    expect(screen.getByTestId('state')).toHaveTextContent('exited');
    
    // After enterDelay, should change to entering
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    expect(screen.getByTestId('state')).toHaveTextContent('entering');
    
    // After enterDuration, should be entered
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(screen.getByTestId('state')).toHaveTextContent('entered');
    
    // Click stop button
    act(() => {
      screen.getByTestId('stop-btn').click();
    });
    
    // Should still be in entered state during exitDelay
    expect(screen.getByTestId('state')).toHaveTextContent('entered');
    
    // After exitDelay, should change to exiting
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    expect(screen.getByTestId('state')).toHaveTextContent('exiting');
    
    // After exitDuration, should be exited
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(screen.getByTestId('state')).toHaveTextContent('exited');
  });

  it('calls callbacks at the right time', () => {
    const onEnter = jest.fn();
    const onEntered = jest.fn();
    const onExit = jest.fn();
    const onExited = jest.fn();
    
    render(<TestComponent 
      initialState="exited" 
      enterDuration={300} 
      exitDuration={300}
      onEnter={onEnter}
      onEntered={onEntered}
      onExit={onExit}
      onExited={onExited}
    />);
    
    // Initially, no callbacks should be called
    expect(onEnter).not.toHaveBeenCalled();
    expect(onEntered).not.toHaveBeenCalled();
    expect(onExit).not.toHaveBeenCalled();
    expect(onExited).not.toHaveBeenCalled();
    
    // Click start button
    act(() => {
      screen.getByTestId('start-btn').click();
    });
    
    // onEnter should be called immediately
    expect(onEnter).toHaveBeenCalled();
    expect(onEntered).not.toHaveBeenCalled();
    
    // After enterDuration, onEntered should be called
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(onEntered).toHaveBeenCalled();
    
    // Click stop button
    act(() => {
      screen.getByTestId('stop-btn').click();
    });
    
    // onExit should be called immediately
    expect(onExit).toHaveBeenCalled();
    expect(onExited).not.toHaveBeenCalled();
    
    // After exitDuration, onExited should be called
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(onExited).toHaveBeenCalled();
  });

  it('handles rapid toggling correctly', () => {
    render(<TestComponent 
      initialState="exited" 
      enterDuration={300} 
      exitDuration={300}
    />);
    
    // Start entering
    act(() => {
      screen.getByTestId('start-btn').click();
    });
    
    expect(screen.getByTestId('state')).toHaveTextContent('entering');
    
    // Quickly toggle back to exiting before enter completes
    act(() => {
      jest.advanceTimersByTime(100); // Only 1/3 through enter transition
      screen.getByTestId('stop-btn').click();
    });
    
    // Should immediately change to exiting
    expect(screen.getByTestId('state')).toHaveTextContent('exiting');
    
    // Complete the exit
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(screen.getByTestId('state')).toHaveTextContent('exited');
  });

  it('can start in the entered state', () => {
    render(<TestComponent initialState="entered" startVisible={false} />);
    expect(screen.getByTestId('state')).toHaveTextContent('entered');
  });

  it('automatically starts transition when startVisible is true', () => {
    render(<TestComponent initialState="exited" startVisible={true} enterDuration={300} />);
    
    // Should immediately change to entering
    expect(screen.getByTestId('state')).toHaveTextContent('entering');
    
    // After enterDuration, should be entered
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(screen.getByTestId('state')).toHaveTextContent('entered');
  });
}); 