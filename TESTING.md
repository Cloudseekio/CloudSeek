# Testing Strategy and Best Practices

## Table of Contents
- [Overview](#overview)
- [Testing Architecture](#testing-architecture)
- [Test Organization](#test-organization)
- [Component Testing Patterns](#component-testing-patterns)
  - [Pagination Components](#pagination-components)
  - [Loading Components](#loading-components)
  - [UI Components with Animation](#ui-components-with-animation)
  - [Error Boundary Components](#error-boundary-components)
  - [Context Providers](#context-providers)
- [Mocking Strategies](#mocking-strategies)
  - [Browser APIs](#browser-apis)
  - [External Dependencies](#external-dependencies)
  - [Internal Services](#internal-services)
- [Testing Utilities](#testing-utilities)
  - [Mock Factories](#mock-factories)
  - [Test Helpers](#test-helpers)
- [Debugging Tests](#debugging-tests)
  - [Common Issues](#common-issues)
  - [Troubleshooting Techniques](#troubleshooting-techniques)
- [Continuous Integration](#continuous-integration)

## Overview

This document outlines our testing approach, patterns, and best practices for the application. Our testing philosophy focuses on:

1. **Isolation**: Components should be tested in isolation with appropriate mocks.
2. **Realism**: Tests should simulate real user behavior as closely as possible.
3. **Maintainability**: Tests should be easy to understand and maintain.
4. **Coverage**: We aim for high test coverage while focusing on critical paths.
5. **Performance**: Tests should run quickly and reliably.

## Testing Architecture

Our testing architecture consists of several layers:

- **Unit Tests**: For individual components, hooks, and utility functions.
- **Integration Tests**: For component interactions and complex behaviors.
- **Snapshot Tests**: For UI regression testing.
- **Mock Strategy**: We use mocks to isolate components during testing.

We use the following testing libraries:

- **Jest**: For test running, assertions, and mocking.
- **React Testing Library**: For rendering components and simulating user interactions.
- **Mock Service Worker (MSW)**: For API mocking.

## Test Organization

Our tests follow a consistent organization pattern:

### Directory Structure
```
src/
  __tests__/
    components/
      [component-category]/
        [ComponentName].test.tsx
    hooks/
      [hookName].test.ts
    utils/
      [utilityName].test.ts
    context/
      [contextName].test.tsx
```

### Test File Structure
Each test file should follow this general structure:

```typescript
// Import statements
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentToTest from '../path/to/component';

// Mock setup (if needed)
jest.mock('../path/to/dependency', () => ({
  someFunction: jest.fn(),
}));

// Test suite
describe('ComponentName', () => {
  // Setup and teardown
  beforeEach(() => {
    // Common setup
  });

  afterEach(() => {
    // Cleanup
    jest.clearAllMocks();
  });

  // Test cases grouped by functionality
  describe('rendering', () => {
    it('renders correctly with default props', () => {
      // Test implementation
    });
  });

  describe('interactions', () => {
    it('handles user interactions correctly', () => {
      // Test implementation
    });
  });
});
```

## Component Testing Patterns

### Pagination Components

#### Infinite Scroll Testing

Infinite scroll components require special handling due to their dependency on the IntersectionObserver API:

1. **Mock the IntersectionObserver**:
   ```typescript
   // Mock IntersectionObserver
   const mockIntersectionObserver = jest.fn();
   const mockObserve = jest.fn();
   const mockUnobserve = jest.fn();
   const mockDisconnect = jest.fn();

   // Store the callback for later use
   let intersectionCallback: (entries: { target: Element; isIntersecting: boolean }[]) => void;

   beforeEach(() => {
     // Reset all mocks
     jest.clearAllMocks();
     
     // Setup IntersectionObserver mock
     mockIntersectionObserver.mockImplementation(callback => {
       intersectionCallback = callback;
       return {
         observe: mockObserve,
         unobserve: mockUnobserve,
         disconnect: mockDisconnect,
       };
     });
     
     global.IntersectionObserver = mockIntersectionObserver;
   });
   ```

2. **Simulate Intersection Events**:
   ```typescript
   // Create mock entries with the matching targets
   const mockBottomEntry = { 
     target: {
       classList: { contains: (name: string) => name === 'bottom-trigger' }
     },
     isIntersecting: true 
   };
   
   // Trigger the intersection callback
   await act(async () => {
     if (intersectionCallback) {
       intersectionCallback([mockBottomEntry as unknown as IntersectionObserverEntry]);
     }
   });
   ```

3. **Add Test-Friendly Class Names to Components**:
   ```tsx
   <div ref={triggerRef} className="loading-trigger bottom-trigger">
     {loadingMore && loadingIndicator}
   </div>
   ```

#### Bidirectional Scroll Testing

For bidirectional scroll components, test both top and bottom triggers:

```typescript
it('calls onLoadMore when bottom trigger intersects', async () => {
  // Setup and render component
  
  // Mock bottom entry with bottom-trigger class
  const mockBottomEntry = { 
    target: {
      classList: { contains: (name: string) => name === 'bottom-trigger' }
    },
    isIntersecting: true 
  };
  
  // Trigger intersection
  await act(async () => {
    intersectionCallback([mockBottomEntry as unknown as IntersectionObserverEntry]);
  });
  
  expect(onLoadMore).toHaveBeenCalled();
});

it('calls onLoadPrevious when top trigger intersects', async () => {
  // Setup and render component
  
  // Mock top entry with top-trigger class
  const mockTopEntry = { 
    target: {
      classList: { contains: (name: string) => name === 'top-trigger' }
    },
    isIntersecting: true 
  };
  
  // Trigger intersection
  await act(async () => {
    intersectionCallback([mockTopEntry as unknown as IntersectionObserverEntry]);
  });
  
  expect(onLoadPrevious).toHaveBeenCalled();
});
```

### Loading Components

#### Testing Loading States

1. **Test Delayed Loading**:
   ```typescript
   it('shows loading indicator after delay', () => {
     // Setup fake timers
     jest.useFakeTimers();
     
     // Render with loading=true
     render(<LoadingComponent isLoading={true} />);
     
     // Initially, loading indicator should not be visible
     expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
     
     // Advance timers
     act(() => {
       jest.advanceTimersByTime(300); // Delay time
     });
     
     // Now loading indicator should be visible
     expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
     
     // Cleanup
     jest.useRealTimers();
   });
   ```

2. **Test Loading Progress**:
   ```typescript
   it('shows correct progress percentage', () => {
     // Mock progress hook
     const mockProgress = 75;
     jest.mock('../../hooks/useLoadingProgress', () => ({
       __esModule: true,
       default: jest.fn(() => mockProgress),
     }));
     
     render(<LoadingIndicator showProgress />);
     
     // Check that progress is displayed
     expect(screen.getByText('75%')).toBeInTheDocument();
   });
   ```

3. **Test Accessibility**:
   ```typescript
   it('has proper accessibility attributes', () => {
     render(<LoadingGuard isLoading={true} />);
     
     // Check for appropriate ARIA attributes
     const loadingElement = screen.getByRole('status');
     expect(loadingElement).toHaveAttribute('aria-live', 'polite');
     expect(loadingElement).toHaveAttribute('aria-atomic', 'true');
     
     // Check for screen reader text
     expect(screen.getByText(/loading/i, { selector: '.sr-only' })).toBeInTheDocument();
   });
   ```

### UI Components with Animation

#### Testing Animations

1. **Mock Animation Timers**:
   ```typescript
   it('applies animation classes correctly', () => {
     jest.useFakeTimers();
     
     render(<AnimatedComponent />);
     
     // Initial state (before animation)
     expect(screen.getByTestId('animated-element')).toHaveClass('opacity-0');
     
     // Trigger animation
     act(() => {
       jest.advanceTimersByTime(100);
     });
     
     // Final state (after animation)
     expect(screen.getByTestId('animated-element')).toHaveClass('opacity-100');
     
     jest.useRealTimers();
   });
   ```

2. **Test Animation Completion Callbacks**:
   ```typescript
   it('calls onComplete after animation finishes', () => {
     jest.useFakeTimers();
     
     const onComplete = jest.fn();
     render(<AnimatedComponent onComplete={onComplete} />);
     
     // Verify callback not called initially
     expect(onComplete).not.toHaveBeenCalled();
     
     // Advance past animation duration
     act(() => {
       jest.advanceTimersByTime(500); // Animation duration
     });
     
     // Verify callback was called
     expect(onComplete).toHaveBeenCalledTimes(1);
     
     jest.useRealTimers();
   });
   ```

3. **Mock requestAnimationFrame**:
   ```typescript
   beforeEach(() => {
     // Setup requestAnimationFrame mock
     jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
       return setTimeout(() => cb(performance.now()), 16);
     });
   });
   
   afterEach(() => {
     // Cleanup
     window.requestAnimationFrame.mockRestore();
   });
   ```

### Error Boundary Components

#### Testing Error Boundaries

Error boundaries require special handling since they catch errors during rendering:

1. **Create Components That Throw Errors**:
   ```typescript
   const ErrorComponent = () => {
     throw new Error('Test error');
   };
   
   it('catches rendering errors', () => {
     // Suppress console.error for this test
     const originalConsoleError = console.error;
     console.error = jest.fn();
     
     render(
       <ErrorBoundary fallback={<div data-testid="error-fallback">Error occurred</div>}>
         <ErrorComponent />
       </ErrorBoundary>
     );
     
     // Check that fallback is rendered
     expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
     
     // Restore console.error
     console.error = originalConsoleError;
   });
   ```

2. **Test Error Reset**:
   ```typescript
   it('resets error state when reset is called', async () => {
     // Suppress console errors
     const originalConsoleError = console.error;
     console.error = jest.fn();
     
     // Set up a state to toggle between error and non-error component
     const TestWrapper = () => {
       const [shouldError, setShouldError] = useState(true);
       
       return (
         <>
           <button onClick={() => setShouldError(false)}>Reset</button>
           <ErrorBoundary fallback={<div data-testid="error-fallback">Error</div>}>
             {shouldError ? <ErrorComponent /> : <div>No Error</div>}
           </ErrorBoundary>
         </>
       );
     };
     
     render(<TestWrapper />);
     
     // Verify error fallback is shown
     expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
     
     // Click reset button
     fireEvent.click(screen.getByText('Reset'));
     
     // Verify normal content is shown
     expect(screen.getByText('No Error')).toBeInTheDocument();
     
     // Restore console.error
     console.error = originalConsoleError;
   });
   ```

### Context Providers

#### Testing Context Providers

1. **Create a Test Consumer Component**:
   ```typescript
   const TestConsumer = () => {
     const contextValue = useMyContext();
     return (
       <div>
         <span data-testid="value">{contextValue.value}</span>
         <button onClick={contextValue.increment}>Increment</button>
       </div>
     );
   };
   
   it('provides the correct context value', () => {
     render(
       <MyContextProvider initialValue={5}>
         <TestConsumer />
       </MyContextProvider>
     );
     
     // Check initial value
     expect(screen.getByTestId('value')).toHaveTextContent('5');
     
     // Trigger context update
     fireEvent.click(screen.getByText('Increment'));
     
     // Check updated value
     expect(screen.getByTestId('value')).toHaveTextContent('6');
   });
   ```

2. **Mock Context for Component Testing**:
   ```typescript
   // Create a mock context
   const mockContextValue = {
     value: 10,
     increment: jest.fn(),
   };
   
   // Mock the context hook
   jest.mock('../../context/MyContext', () => ({
     useMyContext: () => mockContextValue,
   }));
   
   it('uses context values correctly', () => {
     render(<ComponentThatUsesContext />);
     
     // Verify component behavior with mock context
     expect(screen.getByText('Value: 10')).toBeInTheDocument();
     
     // Simulate action that uses context
     fireEvent.click(screen.getByText('Update'));
     
     // Verify context method was called
     expect(mockContextValue.increment).toHaveBeenCalled();
   });
   ```

## Mocking Strategies

### Browser APIs

#### IntersectionObserver

```typescript
// Mock IntersectionObserver globally
const mockIntersectionObserver = jest.fn();

beforeAll(() => {
  global.IntersectionObserver = mockIntersectionObserver;
});

beforeEach(() => {
  mockIntersectionObserver.mockReset().mockImplementation((callback) => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});
```

#### Animation and Timing APIs

```typescript
// Mock requestAnimationFrame
beforeAll(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => setTimeout(() => cb(0), 0));
});

afterAll(() => {
  window.requestAnimationFrame.mockRestore();
});

// Mock performance.now
beforeAll(() => {
  jest.spyOn(performance, 'now').mockReturnValue(1000);
});

afterAll(() => {
  performance.now.mockRestore();
});
```

#### Local Storage

```typescript
// Create mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Install the mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

beforeEach(() => {
  // Clear storage and reset mocks before each test
  mockLocalStorage.clear();
  jest.clearAllMocks();
});
```

### External Dependencies

#### Service APIs

```typescript
// Mock the blog service
const mockBlogService = {
  getPosts: jest.fn().mockResolvedValue({
    items: [
      { id: '1', title: 'Test Post 1' },
      { id: '2', title: 'Test Post 2' },
    ],
    total: 2,
  }),
  getPostById: jest.fn().mockImplementation((id) => {
    const posts = [
      { id: '1', title: 'Test Post 1', content: 'Content 1' },
      { id: '2', title: 'Test Post 2', content: 'Content 2' },
    ];
    return Promise.resolve(posts.find(post => post.id === id) || null);
  }),
};

jest.mock('../../services/blogService', () => ({
  __esModule: true,
  default: mockBlogService,
}));
```

#### Router

```typescript
// Mock React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ slug: 'test-post' }),
  useLocation: () => ({ pathname: '/blog/test-post' }),
  useNavigate: () => jest.fn(),
  useSearchParams: () => [
    new URLSearchParams('?category=technology'),
    jest.fn(),
  ],
}));
```

### Internal Services

#### Context Providers

```typescript
// Mock context providers with default test values
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ 
    theme: 'light', 
    toggleTheme: jest.fn() 
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// With the ability to override for specific tests
const mockUseAuth = jest.fn();
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Then in tests
it('shows user info when logged in', () => {
  mockUseAuth.mockReturnValue({ 
    user: { name: 'Test User' }, 
    isAuthenticated: true 
  });
  
  render(<ProfileComponent />);
  
  expect(screen.getByText('Test User')).toBeInTheDocument();
});
```

## Testing Utilities

### Mock Factories

```typescript
// src/__tests__/utils/mockFactories.ts

/**
 * Creates a mock IntersectionObserver with controllable behavior
 */
export function createMockIntersectionObserver() {
  let callback: IntersectionObserverCallback;
  const mockObserve = jest.fn();
  const mockUnobserve = jest.fn();
  const mockDisconnect = jest.fn();
  
  const mockIntersectionObserver = jest.fn().mockImplementation((cb) => {
    callback = cb;
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    };
  });
  
  // Helper to simulate intersection
  const simulateIntersection = (elements: Element[], isIntersecting: boolean) => {
    const entries = elements.map(target => ({
      isIntersecting,
      target,
      boundingClientRect: { top: 0, bottom: 0 },
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {},
      rootBounds: {},
      time: Date.now(),
    }));
    
    callback(entries, { disconnect: mockDisconnect } as unknown as IntersectionObserver);
  };
  
  return {
    mock: mockIntersectionObserver,
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
    simulateIntersection,
  };
}

/**
 * Creates a mock PerformanceObserver
 */
export function createMockPerformanceObserver() {
  return {
    observe: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn().mockReturnValue([]),
  };
}

/**
 * Creates a mock ResizeObserver
 */
export function createMockResizeObserver() {
  return {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  };
}
```

### Test Helpers

```typescript
// src/__tests__/utils/testHelpers.ts

import { act } from '@testing-library/react';

/**
 * Helper to advance timers and update the UI
 */
export function advanceTimers(ms: number) {
  act(() => {
    jest.advanceTimersByTime(ms);
  });
}

/**
 * Helper to wait for all promises to resolve
 */
export async function flushPromises() {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
}

/**
 * Helper to create a mock component with specific props
 */
export function createMockComponent<T extends object>(displayName: string) {
  const component = (props: T) => <div data-testid={displayName} data-props={JSON.stringify(props)} />;
  component.displayName = displayName;
  return component;
}

/**
 * Helper to render a component with standard providers
 */
export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>{ui}</RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

## Debugging Tests

### Common Issues

#### 1. Act Warnings

React warns when state updates happen outside of `act()`:

```
Warning: An update to Component inside a test was not wrapped in act(...).
```

**Solution**: Wrap state updates in `act()`:

```typescript
await act(async () => {
  fireEvent.click(button);
  // Wait for any promises to resolve
  await new Promise(resolve => setTimeout(resolve, 0));
});
```

#### 2. Async Testing Issues

**Problem**: Tests pass when they shouldn't because assertions run before async operations complete.

**Solution**: Use `await` with Testing Library's async utilities:

```typescript
// ❌ Incorrect
fireEvent.click(submitButton);
expect(screen.getByText('Success')).toBeInTheDocument();

// ✅ Correct
fireEvent.click(submitButton);
await screen.findByText('Success');
```

#### 3. Component Not Found

**Problem**: Testing Library cannot find elements you expect to be there.

**Solution**: Use TestID as a fallback:

```tsx
// In component
<div data-testid="user-profile">
  <h2>{user.name}</h2>
</div>

// In test
const profile = screen.getByTestId('user-profile');
expect(profile).toBeInTheDocument();
```

### Troubleshooting Techniques

#### 1. Debug Output

Use Testing Library's debug function:

```typescript
const { debug } = render(<MyComponent />);
debug();
```

#### 2. Testing In Isolation

If a component test is failing, test its subcomponents separately:

```typescript
// Test child component first
it('ChildComponent renders correctly', () => {
  render(<ChildComponent data={mockData} />);
  // Assertions for child
});

// Then test parent with mocked child
jest.mock('../ChildComponent', () => ({
  ChildComponent: () => <div data-testid="mocked-child" />
}));

it('ParentComponent renders correctly', () => {
  render(<ParentComponent />);
  expect(screen.getByTestId('mocked-child')).toBeInTheDocument();
});
```

#### 3. Manual Mock Implementation

For complex mocks, implement behavior manually:

```typescript
// Mock complicated API
jest.mock('../../api/complexApi', () => ({
  fetchData: jest.fn().mockImplementation((id) => {
    if (id === 'valid') {
      return Promise.resolve({ data: 'success' });
    } else if (id === 'error') {
      return Promise.reject(new Error('API Error'));
    } else {
      return Promise.resolve(null);
    }
  }),
}));
```

## Continuous Integration

### Testing in CI Environment

Our CI pipeline runs tests in the following stages:

1. **Linting and Type Checking**: Ensures code quality.
2. **Unit Tests**: Runs all unit tests.
3. **Integration Tests**: Runs integration tests.
4. **Coverage Report**: Generates and stores test coverage data.

### Environment Variables

Tests that need environment variables should use Jest's `setupFiles` to set default values:

```javascript
// jest.config.js
module.exports = {
  setupFiles: ['<rootDir>/jest.setup.env.js'],
};

// jest.setup.env.js
process.env.API_URL = 'http://mock-api.test';
process.env.FEATURE_FLAGS = '{"newFeature": true}';
```

### Test Coverage Goals

We aim for the following coverage targets:

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 85%
- **Lines**: 80%

Critical components and utilities should have higher coverage (90%+).

---

This document is a living guide to our testing practices. As we discover new patterns and better approaches, we'll update this documentation to reflect our evolving best practices. 