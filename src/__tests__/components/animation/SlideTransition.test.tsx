import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { SlideTransition } from '../../../components/animation/SlideTransition';
import { animationTestSetup } from '../../../testUtils/animationMocks';

describe('SlideTransition', () => {
  // Set up animation testing utilities
  beforeEach(() => {
    animationTestSetup.beforeEach();
  });

  afterEach(() => {
    animationTestSetup.afterEach();
  });

  it('renders children when in={true}', () => {
    render(
      <SlideTransition in={true} enterDuration={300} exitDuration={300}>
        <div data-testid="test-content">Test Content</div>
      </SlideTransition>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('applies correct transform styles based on direction (down)', () => {
    const { rerender, container } = render(
      <SlideTransition 
        in={false} 
        enterDuration={300} 
        exitDuration={300}
        direction="down"
        distance={100}
      >
        <div data-testid="test-content">Test Content</div>
      </SlideTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Initially should have transform with negative translation for "down" direction
    expect(transitionEl).toHaveStyle({ transform: 'translateY(-100px)' });

    // Change to in={true}
    rerender(
      <SlideTransition 
        in={true} 
        enterDuration={300} 
        exitDuration={300}
        direction="down"
        distance={100}
      >
        <div data-testid="test-content">Test Content</div>
      </SlideTransition>
    );

    // Should immediately start transition with starting transform
    expect(transitionEl).toHaveStyle({ transform: 'translateY(-100px)' });

    // After enter duration, should have no translation
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now should have no transform
    expect(transitionEl).toHaveStyle({ transform: 'translateY(0px)' });
  });

  it('applies correct transform styles based on direction (up)', () => {
    const { rerender, container } = render(
      <SlideTransition 
        in={false} 
        enterDuration={300} 
        exitDuration={300}
        direction="up"
        distance={100}
      >
        <div data-testid="test-content">Test Content</div>
      </SlideTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Initially should have transform with positive translation for "up" direction
    expect(transitionEl).toHaveStyle({ transform: 'translateY(100px)' });

    // Complete transition to visible
    rerender(
      <SlideTransition 
        in={true} 
        enterDuration={300} 
        exitDuration={300}
        direction="up"
        distance={100}
      >
        <div data-testid="test-content">Test Content</div>
      </SlideTransition>
    );
    
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should have no transformation
    expect(transitionEl).toHaveStyle({ transform: 'translateY(0px)' });
  });

  it('applies correct transform styles based on direction (left)', () => {
    const { rerender, container } = render(
      <SlideTransition 
        in={false} 
        enterDuration={300} 
        exitDuration={300}
        direction="left"
        distance={100}
      >
        <div data-testid="test-content">Test Content</div>
      </SlideTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Initially should have transform with positive translation for "left" direction
    expect(transitionEl).toHaveStyle({ transform: 'translateX(100px)' });

    // Complete transition to visible
    rerender(
      <SlideTransition 
        in={true} 
        enterDuration={300} 
        exitDuration={300}
        direction="left"
        distance={100}
      >
        <div data-testid="test-content">Test Content</div>
      </SlideTransition>
    );
    
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should have no transformation
    expect(transitionEl).toHaveStyle({ transform: 'translateX(0px)' });
  });

  it('applies correct transform styles based on direction (right)', () => {
    const { rerender, container } = render(
      <SlideTransition 
        in={false} 
        enterDuration={300} 
        exitDuration={300}
        direction="right"
        distance={100}
      >
        <div data-testid="test-content">Test Content</div>
      </SlideTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Initially should have transform with negative translation for "right" direction
    expect(transitionEl).toHaveStyle({ transform: 'translateX(-100px)' });

    // Complete transition to visible
    rerender(
      <SlideTransition 
        in={true} 
        enterDuration={300} 
        exitDuration={300}
        direction="right"
        distance={100}
      >
        <div data-testid="test-content">Test Content</div>
      </SlideTransition>
    );
    
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should have no transformation
    expect(transitionEl).toHaveStyle({ transform: 'translateX(0px)' });
  });

  it('handles string distances with CSS units', () => {
    const { container } = render(
      <SlideTransition 
        in={false}
        direction="down"
        distance="50%"
      >
        <div data-testid="test-content">Test Content</div>
      </SlideTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Should use the string distance as-is
    expect(transitionEl).toHaveStyle({ transform: 'translateY(-50%)' });
  });

  it('applies custom className', () => {
    const { container } = render(
      <SlideTransition 
        in={true}
        slideClassName="custom-slide-class"
      >
        <div data-testid="test-content">Test Content</div>
      </SlideTransition>
    );

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    
    // Should have custom class
    expect(transitionEl).toHaveClass('custom-slide-class');
  });

  it('renders correctly when transitioning from in={true} to in={false}', () => {
    const { rerender, container } = render(
      <SlideTransition 
        in={true} 
        enterDuration={300} 
        exitDuration={300}
        direction="down"
        distance={100}
      >
        <div data-testid="test-content">Test Content</div>
      </SlideTransition>
    );

    // Complete enter transition
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Get the transition element (the wrapper div with styles)
    const transitionEl = container.firstChild as HTMLElement;
    expect(transitionEl).toHaveStyle({ transform: 'translateY(0px)' });

    // Change to in={false}
    rerender(
      <SlideTransition 
        in={false} 
        enterDuration={300} 
        exitDuration={300}
        direction="down"
        distance={100}
      >
        <div data-testid="test-content">Test Content</div>
      </SlideTransition>
    );

    // After exit duration, should have hidden transform
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(transitionEl).toHaveStyle({ transform: 'translateY(-100px)' });
  });
}); 