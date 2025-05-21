import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { TransitionComponent } from '../../../components/animation/TransitionComponent';
import { animationTestSetup } from '../../../testUtils/animationMocks';

describe('TransitionComponent', () => {
  // Set up animation testing utilities
  beforeEach(() => {
    animationTestSetup.beforeEach();
  });

  afterEach(() => {
    animationTestSetup.afterEach();
  });

  it('renders children when in={true}', () => {
    render(
      <TransitionComponent in={true} enterDuration={300} exitDuration={300}>
        <div data-testid="test-content">Test Content</div>
      </TransitionComponent>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('does not render children when in={false} and unmountOnExit={true}', () => {
    render(
      <TransitionComponent in={false} enterDuration={300} exitDuration={300} unmountOnExit={true}>
        <div data-testid="test-content">Test Content</div>
      </TransitionComponent>
    );

    expect(screen.queryByTestId('test-content')).not.toBeInTheDocument();
  });

  it('renders children with "entering" status when in changes from false to true', () => {
    const renderFn = jest.fn().mockImplementation((status) => (
      <div data-testid="test-content">{status}</div>
    ));

    const { rerender } = render(
      <TransitionComponent in={false} enterDuration={300} exitDuration={300}>
        {renderFn}
      </TransitionComponent>
    );

    // Initial render - should be "exited"
    expect(renderFn).toHaveBeenCalledWith("exited");
    
    // Change to in={true}
    rerender(
      <TransitionComponent in={true} enterDuration={300} exitDuration={300}>
        {renderFn}
      </TransitionComponent>
    );

    // Should immediately change to "entering"
    expect(renderFn).toHaveBeenCalledWith("entering");
    
    // After enter duration, should be "entered"
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(renderFn).toHaveBeenCalledWith("entered");
  });

  it('renders children with "exiting" status when in changes from true to false', () => {
    const renderFn = jest.fn().mockImplementation((status) => (
      <div data-testid="test-content">{status}</div>
    ));

    // Start with in={true} and status="entered"
    const { rerender } = render(
      <TransitionComponent in={true} enterDuration={300} exitDuration={300}>
        {renderFn}
      </TransitionComponent>
    );

    // Advance past enter duration
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Reset mock to focus on exiting state
    renderFn.mockClear();

    // Change to in={false}
    rerender(
      <TransitionComponent in={false} enterDuration={300} exitDuration={300}>
        {renderFn}
      </TransitionComponent>
    );

    // Should immediately change to "exiting"
    expect(renderFn).toHaveBeenCalledWith("exiting");
    
    // After exit duration, should be "exited"
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(renderFn).toHaveBeenCalledWith("exited");
  });

  it('calls callbacks at the right time', () => {
    const onEnter = jest.fn();
    const onEntered = jest.fn();
    const onExit = jest.fn();
    const onExited = jest.fn();

    const { rerender } = render(
      <TransitionComponent 
        in={false} 
        enterDuration={300} 
        exitDuration={300}
        onEnter={onEnter}
        onEntered={onEntered}
        onExit={onExit}
        onExited={onExited}
      >
        <div data-testid="test-content">Test Content</div>
      </TransitionComponent>
    );

    // Initially, no callbacks should be called
    expect(onEnter).not.toHaveBeenCalled();
    expect(onEntered).not.toHaveBeenCalled();
    expect(onExit).not.toHaveBeenCalled();
    expect(onExited).not.toHaveBeenCalled();

    // Change to in={true}
    rerender(
      <TransitionComponent 
        in={true} 
        enterDuration={300} 
        exitDuration={300}
        onEnter={onEnter}
        onEntered={onEntered}
        onExit={onExit}
        onExited={onExited}
      >
        <div data-testid="test-content">Test Content</div>
      </TransitionComponent>
    );

    // onEnter should be called immediately
    expect(onEnter).toHaveBeenCalled();
    expect(onEntered).not.toHaveBeenCalled();

    // Advance time to completion of enter transition
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // onEntered should now be called
    expect(onEntered).toHaveBeenCalled();

    // Change to in={false}
    rerender(
      <TransitionComponent 
        in={false} 
        enterDuration={300} 
        exitDuration={300}
        onEnter={onEnter}
        onEntered={onEntered}
        onExit={onExit}
        onExited={onExited}
      >
        <div data-testid="test-content">Test Content</div>
      </TransitionComponent>
    );

    // onExit should be called immediately
    expect(onExit).toHaveBeenCalled();
    expect(onExited).not.toHaveBeenCalled();

    // Advance time to completion of exit transition
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // onExited should now be called
    expect(onExited).toHaveBeenCalled();
  });
}); 