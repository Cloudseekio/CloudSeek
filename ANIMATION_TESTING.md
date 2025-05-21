# Testing Animation Components

This guide provides detailed strategies for testing UI components with animations, transitions, and timing-dependent behavior. These components present unique challenges for testing and require specialized approaches.

## Table of Contents
- [Common Challenges](#common-challenges)
- [Mocking Animation APIs](#mocking-animation-apis)
- [Testing CSS Transitions](#testing-css-transitions)
- [Testing CSS Animations](#testing-css-animations)
- [Testing Animation Libraries](#testing-animation-libraries)
- [Performance Testing](#performance-testing)
- [Timing Control](#timing-control)
- [Test Pattern Examples](#test-pattern-examples)

## Common Challenges

Animation testing presents several unique challenges:

1. **Timing Dependencies**: Animations have duration and depend on frame timing
2. **Browser APIs**: Many animations use browser APIs not available in test environments
3. **Side Effects**: Animations can have side effects that are hard to predict in tests
4. **Asynchronous Behavior**: Animation completion is inherently asynchronous
5. **CSS Dependencies**: Many animations use CSS that might be processed differently in tests

## Mocking Animation APIs

### requestAnimationFrame

When testing components that use `requestAnimationFrame`, use this comprehensive mock:

```typescript
// Mock implementation
const mockRequestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  return setTimeout(() => callback(performance.now()), 16); // ~60fps
});

const mockCancelAnimationFrame = jest.fn((handle: number) => {
  clearTimeout(handle);
});

// Setup and teardown
beforeEach(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(mockRequestAnimationFrame);
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(mockCancelAnimationFrame);
});

afterEach(() => {
  window.requestAnimationFrame.mockRestore();
  window.cancelAnimationFrame.mockRestore();
  jest.clearAllMocks();
});
```

For components that chain multiple animation frames, you may need to manually advance frames:

```typescript
// Helper to advance multiple animation frames
function advanceAnimationFrames(count: number) {
  for (let i = 0; i < count; i++) {
    act(() => {
      jest.runOnlyPendingTimers(); // Run the setTimeout in our rAF mock
    });
  }
}

// In test
render(<AnimatedComponent />);
advanceAnimationFrames(5); // Run 5 animation frames
expect(screen.getByTestId('animated-element')).toHaveStyle({ opacity: '1' });
```

### Web Animations API

For components using the Web Animations API (`element.animate()`), create this mock:

```typescript
// Mock Animation object
const mockAnimationPlay = jest.fn();
const mockAnimationPause = jest.fn();
const mockAnimationCancel = jest.fn();
const mockAnimationFinish = jest.fn();

// Mock Animation constructor
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

// Setup and teardown
beforeEach(() => {
  // Override Element.animate
  Element.prototype.animate = jest.fn().mockImplementation(() => new MockAnimation());

  // Reset mocks
  mockAnimationPlay.mockReset();
  mockAnimationPause.mockReset();
  mockAnimationCancel.mockReset();
  mockAnimationFinish.mockReset();
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

Use in tests:

```typescript
it('completes animation and calls onAnimationEnd', () => {
  const onAnimationEnd = jest.fn();
  render(<AnimatedComponent onAnimationEnd={onAnimationEnd} />);
  
  // Get animation instance from the mocked animate call
  const animation = screen.getByTestId('animated-element').animate.mock.results[0].value;
  
  // Simulate animation completion
  animation.finish();
  
  expect(onAnimationEnd).toHaveBeenCalled();
});
```

## Testing CSS Transitions

### Approach 1: Class Assertions

For components that add/remove CSS classes to trigger transitions:

```typescript
it('adds transition class when triggered', () => {
  const { getByTestId } = render(<TransitionComponent />);
  const element = getByTestId('transition-element');
  
  // Initial state
  expect(element).not.toHaveClass('transition-active');
  
  // Trigger transition
  fireEvent.click(getByTestId('trigger-button'));
  
  // Verify class is added
  expect(element).toHaveClass('transition-active');
});
```

### Approach 2: Style Assertions with Timers

For testing the actual style changes during a transition:

```typescript
it('applies transition styles correctly', () => {
  jest.useFakeTimers();
  
  const { getByTestId } = render(<TransitionComponent />);
  const element = getByTestId('transition-element');
  
  // Initial state
  expect(element).toHaveStyle({ opacity: '0' });
  
  // Trigger transition
  fireEvent.click(getByTestId('trigger-button'));
  
  // Mid-transition (run half the duration)
  act(() => {
    jest.advanceTimersByTime(150); // Half of 300ms transition
  });
  
  // Final state (after transition completes)
  act(() => {
    jest.advanceTimersByTime(150); // Remaining half
  });
  expect(element).toHaveStyle({ opacity: '1' });
  
  jest.useRealTimers();
});
```

### Approach 3: onTransitionEnd Events

For components that listen to transitionend events:

```typescript
it('fires onTransitionEnd handler', () => {
  const onTransitionEnd = jest.fn();
  const { getByTestId } = render(<TransitionComponent onTransitionEnd={onTransitionEnd} />);
  
  // Trigger transition
  fireEvent.click(getByTestId('trigger-button'));
  
  // Simulate transitionend event
  fireEvent.transitionEnd(getByTestId('transition-element'));
  
  expect(onTransitionEnd).toHaveBeenCalledTimes(1);
});
```

## Testing CSS Animations

### Testing Animation Classes

For components that add classes with CSS animations:

```typescript
it('applies animation class when triggered', () => {
  const { getByTestId } = render(<AnimatedComponent />);
  const element = getByTestId('animated-element');
  
  // Initial state
  expect(element).not.toHaveClass('animate-bounce');
  
  // Trigger animation
  fireEvent.click(getByTestId('trigger-button'));
  
  // Verify animation class is added
  expect(element).toHaveClass('animate-bounce');
});
```

### Testing Animation Callbacks

For components that listen to animationend events:

```typescript
it('fires onAnimationEnd handler', () => {
  const onAnimationEnd = jest.fn();
  const { getByTestId } = render(<AnimatedComponent onAnimationEnd={onAnimationEnd} />);
  
  // Trigger animation
  fireEvent.click(getByTestId('trigger-button'));
  
  // Simulate animationend event
  fireEvent.animationEnd(getByTestId('animated-element'));
  
  expect(onAnimationEnd).toHaveBeenCalledTimes(1);
});
```

## Testing Animation Libraries

### Testing React Spring

For React Spring animations:

```typescript
// Mock React Spring
jest.mock('react-spring', () => {
  const actual = jest.requireActual('react-spring');
  return {
    ...actual,
    useSpring: jest.fn().mockImplementation((config) => {
      const defaults = {
        opacity: 0,
        transform: 'translateY(20px)'
      };
      
      // If config is a function, call it with the defaults
      if (typeof config === 'function') {
        return [
          { ...defaults, ...config(true) },
          jest.fn()
        ];
      }
      
      // Regular config object
      return [
        { ...defaults, ...config },
        jest.fn()
      ];
    }),
    animated: {
      div: 'div',
      span: 'span',
      // Add other elements as needed
    }
  };
});
```

Use in tests:

```typescript
it('sets up spring animation with correct config', () => {
  const { useSpring } = require('react-spring');
  render(<SpringComponent isVisible={true} />);
  
  expect(useSpring).toHaveBeenCalledWith(expect.objectContaining({
    opacity: 1,
    transform: 'translateY(0px)'
  }));
});
```

### Testing Framer Motion

For Framer Motion animations:

```typescript
// Mock Framer Motion
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: (props) => <div {...props} data-framer-motion-component="div" />,
      span: (props) => <span {...props} data-framer-motion-component="span" />,
      // Add other elements as needed
    },
    AnimatePresence: ({ children }) => children,
  };
});
```

Use in tests:

```typescript
it('renders motion component with correct animation props', () => {
  render(<MotionComponent isVisible={true} />);
  
  const motionElement = screen.getByTestId('animated-element');
  expect(motionElement).toHaveAttribute('data-framer-motion-component', 'div');
  expect(motionElement).toHaveAttribute('animate', 'visible');
});
```

## Performance Testing

For testing animation performance:

```typescript
// In setupTests.js
class MockPerformanceObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe() {}
  disconnect() {}
  
  // Helper to simulate performance entries
  simulateEntry(entry) {
    this.callback({
      getEntries: () => [entry]
    });
  }
}

global.PerformanceObserver = MockPerformanceObserver;
```

Use in tests:

```typescript
it('reports poor animation performance', () => {
  const performanceCallback = jest.fn();
  render(<PerformanceMonitoredAnimation onPoorPerformance={performanceCallback} />);
  
  // Get the PerformanceObserver instance
  const instance = PerformanceObserver.mock.instances[0];
  
  // Simulate a long frame
  instance.simulateEntry({
    duration: 50, // 50ms (well above 16ms target)
    entryType: 'longtask',
    startTime: performance.now()
  });
  
  expect(performanceCallback).toHaveBeenCalled();
});
```

## Timing Control

### Using Fake Timers

For animations that depend on `setTimeout` or `setInterval`:

```typescript
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

it('completes animation after duration', () => {
  const { getByTestId } = render(<TimedAnimation duration={500} />);
  
  // Initial state
  expect(getByTestId('animation')).toHaveClass('animation-start');
  
  // Advance time to 80% of duration
  act(() => {
    jest.advanceTimersByTime(400);
  });
  expect(getByTestId('animation')).toHaveClass('animation-active');
  
  // Complete animation
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(getByTestId('animation')).toHaveClass('animation-complete');
});
```

### Testing Animation Sequencing

For animations that happen in sequence:

```typescript
it('runs animations in sequence', () => {
  jest.useFakeTimers();
  
  const { getByTestId } = render(<SequencedAnimation />);
  
  // Initial state
  expect(getByTestId('stage-1')).toHaveClass('active');
  expect(getByTestId('stage-2')).not.toHaveClass('active');
  expect(getByTestId('stage-3')).not.toHaveClass('active');
  
  // After first animation
  act(() => {
    jest.advanceTimersByTime(500);
  });
  expect(getByTestId('stage-1')).toHaveClass('complete');
  expect(getByTestId('stage-2')).toHaveClass('active');
  
  // After second animation
  act(() => {
    jest.advanceTimersByTime(500);
  });
  expect(getByTestId('stage-2')).toHaveClass('complete');
  expect(getByTestId('stage-3')).toHaveClass('active');
  
  jest.useRealTimers();
});
```

## Test Pattern Examples

### Skeleton Loading Animation

```typescript
it('applies pulse animation to skeleton elements', () => {
  const { getAllByTestId } = render(<SkeletonLoader count={3} />);
  const skeletonItems = getAllByTestId('skeleton-item');
  
  // Verify all items have animation class
  skeletonItems.forEach((item) => {
    expect(item).toHaveClass('animate-pulse');
  });
});

it('animates items with staggered delay', () => {
  const { getAllByTestId } = render(<SkeletonLoader count={3} staggered={true} />);
  const skeletonItems = getAllByTestId('skeleton-item');
  
  // Each item should have a different animation delay
  expect(skeletonItems[0]).toHaveStyle({ animationDelay: '0ms' });
  expect(skeletonItems[1]).toHaveStyle({ animationDelay: '100ms' });
  expect(skeletonItems[2]).toHaveStyle({ animationDelay: '200ms' });
});
```

### Fade Transition

```typescript
it('fades in when component mounts', () => {
  jest.useFakeTimers();
  
  const { getByTestId } = render(<FadeIn duration={300} />);
  const element = getByTestId('fade-element');
  
  // Initial state
  expect(element).toHaveStyle({ opacity: '0' });
  
  // After mounting effects
  act(() => {
    jest.runAllTimers();
  });
  
  // Should be fully visible
  expect(element).toHaveStyle({ opacity: '1' });
  
  jest.useRealTimers();
});

it('fades out when unmounting', () => {
  jest.useFakeTimers();
  
  const { getByTestId, unmount } = render(<FadeIn duration={300} />);
  
  // Skip fade in
  act(() => {
    jest.runAllTimers();
  });
  
  // Start unmounting
  const fadeOut = jest.fn();
  getByTestId('fade-element').addEventListener('transitionend', fadeOut);
  
  unmount();
  
  // Should have started fade out effect
  expect(fadeOut).toHaveBeenCalled();
  
  jest.useRealTimers();
});
```

### Progress Bar Animation

```typescript
it('animates progress bar to target value', () => {
  jest.useFakeTimers();
  
  const { getByTestId, rerender } = render(<ProgressBar value={0} />);
  const progressBar = getByTestId('progress-bar');
  
  // Set new target value
  rerender(<ProgressBar value={75} />);
  
  // Check initial animation state
  expect(progressBar).toHaveStyle({ width: '0%' });
  
  // Advance timers to complete animation
  act(() => {
    jest.advanceTimersByTime(500);
  });
  
  // Should be at target value
  expect(progressBar).toHaveStyle({ width: '75%' });
  
  jest.useRealTimers();
});
```

Remember to adapt these patterns to your specific components and animation implementation. The key is to make tests deterministic by controlling time and animation states. 