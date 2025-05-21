import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ScaleTransition } from '../../../components/animation/ScaleTransition';
import { animationTestSetup } from '../../../testUtils/animationMocks';

describe('ScaleTransition', () => {
  // Set up animation testing utilities
  beforeEach(() => {
    animationTestSetup.beforeEach();
  });

  afterEach(() => {
    animationTestSetup.afterEach();
  });

  it('renders children when in={true}', () => {
    render(
      <ScaleTransition in={true} enterDuration={300} exitDuration={300}>
        <div data-testid="test-content">Test Content</div>
      </ScaleTransition>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('applies correct scale transform styles', () => {
    const { rerender, container } = render(
      <ScaleTransition 
        in={false} 
        enterDuration={300} 
        exitDuration={300}
        visibleScale={1}
        hiddenScale={0.8}
      >
        <div data-testid="test-content">Test Content</div>
      </ScaleTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Initially should have transform with hiddenScale
    expect(transitionEl).toHaveStyle({ transform: 'scale(0.8)' });

    // Change to in={true}
    rerender(
      <ScaleTransition 
        in={true} 
        enterDuration={300} 
        exitDuration={300}
        visibleScale={1}
        hiddenScale={0.8}
      >
        <div data-testid="test-content">Test Content</div>
      </ScaleTransition>
    );

    // Should immediately start transition with starting transform
    expect(transitionEl).toHaveStyle({ transform: 'scale(0.8)' });

    // After enter duration, should have visibleScale
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now should have visibleScale
    expect(transitionEl).toHaveStyle({ transform: 'scale(1)' });
  });

  it('combines scale and opacity when fade=true', () => {
    const { rerender, container } = render(
      <ScaleTransition 
        in={false} 
        enterDuration={300} 
        exitDuration={300}
        visibleScale={1}
        hiddenScale={0.8}
        fade={true}
      >
        <div data-testid="test-content">Test Content</div>
      </ScaleTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Initially should have transform with hiddenScale and opacity 0
    expect(transitionEl).toHaveStyle({ 
      transform: 'scale(0.8)',
      opacity: '0' 
    });

    // Change to in={true}
    rerender(
      <ScaleTransition 
        in={true} 
        enterDuration={300} 
        exitDuration={300}
        visibleScale={1}
        hiddenScale={0.8}
        fade={true}
      >
        <div data-testid="test-content">Test Content</div>
      </ScaleTransition>
    );

    // After enter duration, should have visibleScale and opacity 1
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(transitionEl).toHaveStyle({ 
      transform: 'scale(1)',
      opacity: '1' 
    });
  });

  it('uses custom origin when provided', () => {
    const { container } = render(
      <ScaleTransition 
        in={true}
        enterDuration={0} // Immediate for testing
        origin="top left"
      >
        <div data-testid="test-content">Test Content</div>
      </ScaleTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Should have custom transform origin
    expect(transitionEl).toHaveStyle({ transformOrigin: 'top left' });
  });

  it('applies custom className', () => {
    const { container } = render(
      <ScaleTransition 
        in={true}
        scaleClassName="custom-scale-class"
      >
        <div data-testid="test-content">Test Content</div>
      </ScaleTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Should have custom class
    expect(transitionEl).toHaveClass('custom-scale-class');
  });

  it('renders correctly when transitioning from in={true} to in={false}', () => {
    const { rerender, container } = render(
      <ScaleTransition 
        in={true} 
        enterDuration={300} 
        exitDuration={300}
        visibleScale={1}
        hiddenScale={0.5}
      >
        <div data-testid="test-content">Test Content</div>
      </ScaleTransition>
    );

    // Complete enter transition
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    expect(transitionEl).toHaveStyle({ transform: 'scale(1)' });

    // Change to in={false}
    rerender(
      <ScaleTransition 
        in={false} 
        enterDuration={300} 
        exitDuration={300}
        visibleScale={1}
        hiddenScale={0.5}
      >
        <div data-testid="test-content">Test Content</div>
      </ScaleTransition>
    );

    // After exit duration, should have hiddenScale
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(transitionEl).toHaveStyle({ transform: 'scale(0.5)' });
  });

  it('handles extreme scale values', () => {
    const { container } = render(
      <ScaleTransition 
        in={false}
        visibleScale={2}
        hiddenScale={0}
      >
        <div data-testid="test-content">Test Content</div>
      </ScaleTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Should handle scale(0)
    expect(transitionEl).toHaveStyle({ transform: 'scale(0)' });
  });

  it('works with default scale values', () => {
    // Default is visibleScale=1, hiddenScale=0.9
    const { rerender, container } = render(
      <ScaleTransition in={false} enterDuration={300} exitDuration={300}>
        <div data-testid="test-content">Test Content</div>
      </ScaleTransition>
    );

    const transitionEl = container.firstChild as HTMLElement;
    
    // Should use default hiddenScale (0.9)
    expect(transitionEl).toHaveStyle({ transform: 'scale(0.9)' });

    // Complete transition to visible
    rerender(
      <ScaleTransition in={true} enterDuration={300} exitDuration={300}>
        <div data-testid="test-content">Test Content</div>
      </ScaleTransition>
    );
    
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should use default visibleScale (1)
    expect(transitionEl).toHaveStyle({ transform: 'scale(1)' });
  });
}); 