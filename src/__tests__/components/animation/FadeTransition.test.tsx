import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { FadeTransition } from '../../../components/animation/FadeTransition';
import { animationTestSetup } from '../../../testUtils/animationMocks';

describe('FadeTransition', () => {
  // Set up animation testing utilities
  beforeEach(() => {
    animationTestSetup.beforeEach();
  });

  afterEach(() => {
    animationTestSetup.afterEach();
  });

  it('renders children when in={true}', () => {
    render(
      <FadeTransition in={true} enterDuration={300} exitDuration={300}>
        <div data-testid="test-content">Test Content</div>
      </FadeTransition>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('applies correct opacity styles based on visibility', () => {
    const { rerender, container } = render(
      <FadeTransition 
        in={false} 
        enterDuration={300} 
        exitDuration={300}
        visibleOpacity={1}
        hiddenOpacity={0}
      >
        <div data-testid="test-content">Test Content</div>
      </FadeTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Initially should have hiddenOpacity
    expect(transitionEl).toHaveStyle({ opacity: '0' });

    // Change to in={true}
    rerender(
      <FadeTransition 
        in={true} 
        enterDuration={300} 
        exitDuration={300}
        visibleOpacity={1}
        hiddenOpacity={0}
      >
        <div data-testid="test-content">Test Content</div>
      </FadeTransition>
    );

    // Should immediately start transition with hiddenOpacity
    expect(transitionEl).toHaveStyle({ opacity: '0' });

    // After enter duration, should have visibleOpacity
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now should have visibleOpacity
    expect(transitionEl).toHaveStyle({ opacity: '1' });
  });

  it('supports custom opacity values', () => {
    const { container } = render(
      <FadeTransition 
        in={true} 
        enterDuration={0} // Immediate transition for testing
        visibleOpacity={0.8}
        hiddenOpacity={0.2}
      >
        <div data-testid="test-content">Test Content</div>
      </FadeTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Should have custom visibleOpacity
    expect(transitionEl).toHaveStyle({ opacity: '0.8' });
  });

  it('applies transform when useTransform is true', () => {
    const { container } = render(
      <FadeTransition 
        in={true} 
        enterDuration={0} // Immediate transition for testing
        useTransform={true}
      >
        <div data-testid="test-content">Test Content</div>
      </FadeTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Should have transform style
    expect(transitionEl).toHaveStyle({ transform: 'translateZ(0)' });
  });

  it('applies custom className', () => {
    const { container } = render(
      <FadeTransition 
        in={true}
        fadeClassName="custom-fade-class"
      >
        <div data-testid="test-content">Test Content</div>
      </FadeTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Should have custom class
    expect(transitionEl).toHaveClass('custom-fade-class');
  });

  it('renders correctly when transitioning from in={true} to in={false}', () => {
    const { rerender, container } = render(
      <FadeTransition 
        in={true} 
        enterDuration={300} 
        exitDuration={300}
      >
        <div data-testid="test-content">Test Content</div>
      </FadeTransition>
    );

    // Complete enter transition
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    expect(transitionEl).toHaveStyle({ opacity: '1' });

    // Change to in={false}
    rerender(
      <FadeTransition 
        in={false} 
        enterDuration={300} 
        exitDuration={300}
      >
        <div data-testid="test-content">Test Content</div>
      </FadeTransition>
    );

    // After exit duration, should have opacity 0
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(transitionEl).toHaveStyle({ opacity: '0' });
  });
}); 