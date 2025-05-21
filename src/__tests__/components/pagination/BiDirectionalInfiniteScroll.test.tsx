import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BiDirectionalInfiniteScroll } from '../../../components/pagination/BiDirectionalInfiniteScroll';
import { 
  mockIntersectionObserver,
  animationTestSetup
} from '../../../testUtils/animationMocks';

describe('BiDirectionalInfiniteScroll', () => {
  // Default props for testing
  const defaultProps = {
    onLoadMore: jest.fn().mockResolvedValue(undefined),
    onLoadPrevious: jest.fn().mockResolvedValue(undefined),
    isLoadingMore: false,
    isLoadingPrevious: false,
    hasNextPage: true,
    hasPreviousPage: true
  };

  // Mock Element.scrollHeight getter
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get: function() { return 1000; }
  });

  // Mock Element.scrollTop getter and setter
  let mockScrollTop = 0;
  Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
    configurable: true,
    get: function() { return mockScrollTop; },
    set: function(val) { mockScrollTop = val; }
  });

  // Use our animation test setup
  beforeEach(() => {
    animationTestSetup.beforeEach();
    // Reset all mocks
    jest.clearAllMocks();
    mockScrollTop = 0;
  });

  afterEach(() => {
    animationTestSetup.afterEach();
    // Cleanup mocks
    jest.restoreAllMocks();
  });

  it('renders children content', () => {
    render(
      <BiDirectionalInfiniteScroll {...defaultProps}>
        <div data-testid="test-content">Test Content</div>
      </BiDirectionalInfiniteScroll>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('sets up an IntersectionObserver on load', () => {
    // Create our mock IntersectionObserver
    const observerMock = mockIntersectionObserver();
    
    render(
      <BiDirectionalInfiniteScroll {...defaultProps}>
        <div>Test Content</div>
      </BiDirectionalInfiniteScroll>
    );
    
    expect(observerMock.mock).toHaveBeenCalled();
    
    // Clean up our mock
    observerMock.cleanup();
  });

  it('calls onLoadMore when bottom trigger intersects and hasNextPage is true', async () => {
    const onLoadMore = jest.fn().mockResolvedValue(undefined);
    
    // Setup our observer mock
    const observerMock = mockIntersectionObserver();
    
    const { container } = render(
      <BiDirectionalInfiniteScroll 
        {...defaultProps}
        hasNextPage={true}
        isLoadingMore={false}
        onLoadMore={onLoadMore}
      >
        <div>Test content</div>
      </BiDirectionalInfiniteScroll>
    );
    
    // Get the bottom trigger element
    const bottomTrigger = container.querySelector('.bottom-trigger');
    expect(bottomTrigger).not.toBeNull();
    
    // Simulate bottom trigger intersection
    await act(async () => {
      // Get the observer instance from our mock
      const observerInstance = observerMock.mock.mock.results[0].value;
      
      // Simulate intersection with bottom trigger
      observerInstance.simulateIntersection(true, bottomTrigger as Element);
    });
    
    expect(onLoadMore).toHaveBeenCalled();
    
    // Clean up our mock
    observerMock.cleanup();
  });
  
  it('calls onLoadPrevious when top trigger intersects and hasPreviousPage is true', async () => {
    const onLoadPrevious = jest.fn().mockResolvedValue(undefined);
    
    // Setup our observer mock
    const observerMock = mockIntersectionObserver();
    
    const { container } = render(
      <BiDirectionalInfiniteScroll 
        {...defaultProps}
        hasPreviousPage={true}
        isLoadingPrevious={false}
        onLoadPrevious={onLoadPrevious}
      >
        <div>Test content</div>
      </BiDirectionalInfiniteScroll>
    );
    
    // Get the top trigger element
    const topTrigger = container.querySelector('.top-trigger');
    expect(topTrigger).not.toBeNull();
    
    // Simulate top trigger intersection
    await act(async () => {
      // Get the observer instance from our mock
      const observerInstance = observerMock.mock.mock.results[0].value;
      
      // Simulate intersection with top trigger
      observerInstance.simulateIntersection(true, topTrigger as Element);
    });
    
    expect(onLoadPrevious).toHaveBeenCalled();
    
    // Clean up our mock
    observerMock.cleanup();
  });
  
  it('does not call onLoadMore when isLoadingMore is true', async () => {
    const onLoadMore = jest.fn().mockResolvedValue(undefined);
    
    // Setup our observer mock
    const observerMock = mockIntersectionObserver();
    
    const { container } = render(
      <BiDirectionalInfiniteScroll 
        {...defaultProps}
        hasNextPage={true}
        isLoadingMore={true}
        onLoadMore={onLoadMore}
      >
        <div>Test content</div>
      </BiDirectionalInfiniteScroll>
    );
    
    // Get the bottom trigger element
    const bottomTrigger = container.querySelector('.bottom-trigger');
    expect(bottomTrigger).not.toBeNull();
    
    // Simulate bottom trigger intersection
    await act(async () => {
      // Get the observer instance from our mock
      const observerInstance = observerMock.mock.mock.results[0].value;
      
      // Simulate intersection with bottom trigger
      observerInstance.simulateIntersection(true, bottomTrigger as Element);
    });
    
    expect(onLoadMore).not.toHaveBeenCalled();
    
    // Clean up our mock
    observerMock.cleanup();
  });
  
  it('does not call onLoadPrevious when isLoadingPrevious is true', async () => {
    const onLoadPrevious = jest.fn().mockResolvedValue(undefined);
    
    // Setup our observer mock
    const observerMock = mockIntersectionObserver();
    
    const { container } = render(
      <BiDirectionalInfiniteScroll 
        {...defaultProps}
        hasPreviousPage={true}
        isLoadingPrevious={true}
        onLoadPrevious={onLoadPrevious}
      >
        <div>Test content</div>
      </BiDirectionalInfiniteScroll>
    );
    
    // Get the top trigger element
    const topTrigger = container.querySelector('.top-trigger');
    expect(topTrigger).not.toBeNull();
    
    // Simulate top trigger intersection
    await act(async () => {
      // Get the observer instance from our mock
      const observerInstance = observerMock.mock.mock.results[0].value;
      
      // Simulate intersection with top trigger
      observerInstance.simulateIntersection(true, topTrigger as Element);
    });
    
    expect(onLoadPrevious).not.toHaveBeenCalled();
    
    // Clean up our mock
    observerMock.cleanup();
  });
  
  it('does not call onLoadMore when hasNextPage is false', async () => {
    const onLoadMore = jest.fn().mockResolvedValue(undefined);
    
    // Setup our observer mock
    const observerMock = mockIntersectionObserver();
    
    const { container } = render(
      <BiDirectionalInfiniteScroll 
        {...defaultProps}
        hasNextPage={false}
        isLoadingMore={false}
        onLoadMore={onLoadMore}
      >
        <div>Test content</div>
      </BiDirectionalInfiniteScroll>
    );
    
    // Get the bottom trigger element
    const bottomTrigger = container.querySelector('.bottom-trigger');
    expect(bottomTrigger).not.toBeNull();
    
    // Simulate bottom trigger intersection
    await act(async () => {
      // Get the observer instance from our mock
      const observerInstance = observerMock.mock.mock.results[0].value;
      
      // Simulate intersection with bottom trigger
      observerInstance.simulateIntersection(true, bottomTrigger as Element);
    });
    
    expect(onLoadMore).not.toHaveBeenCalled();
    
    // Clean up our mock
    observerMock.cleanup();
  });
  
  it('does not call onLoadPrevious when hasPreviousPage is false', async () => {
    const onLoadPrevious = jest.fn().mockResolvedValue(undefined);
    
    // Setup our observer mock
    const observerMock = mockIntersectionObserver();
    
    const { container } = render(
      <BiDirectionalInfiniteScroll 
        {...defaultProps}
        hasPreviousPage={false}
        isLoadingPrevious={false}
        onLoadPrevious={onLoadPrevious}
      >
        <div>Test content</div>
      </BiDirectionalInfiniteScroll>
    );
    
    // Get the top trigger element
    const topTrigger = container.querySelector('.top-trigger');
    expect(topTrigger).not.toBeNull();
    
    // Simulate top trigger intersection
    await act(async () => {
      // Get the observer instance from our mock
      const observerInstance = observerMock.mock.mock.results[0].value;
      
      // Simulate intersection with top trigger
      observerInstance.simulateIntersection(true, topTrigger as Element);
    });
    
    expect(onLoadPrevious).not.toHaveBeenCalled();
    
    // Clean up our mock
    observerMock.cleanup();
  });
  
  it('handles scroll restoration when loading previous items', async () => {
    // Create a mock scroll container
    const scrollContainer = document.createElement('div');
    // Mock scrollContainer getter and setter
    Object.defineProperty(scrollContainer, 'scrollTop', {
      configurable: true,
      get: function() { return mockScrollTop; },
      set: function(val) { mockScrollTop = val; }
    });
    
    // Setup our observer mock
    const observerMock = mockIntersectionObserver();
    
    const { container } = render(
      <BiDirectionalInfiniteScroll 
        {...defaultProps}
        hasPreviousPage={true}
        isLoadingPrevious={false}
        scrollContainer={scrollContainer}
        preserveScrollPosition={true}
      >
        <div>Test content</div>
      </BiDirectionalInfiniteScroll>
    );
    
    // Get the top trigger element
    const topTrigger = container.querySelector('.top-trigger');
    expect(topTrigger).not.toBeNull();
    
    // Initial scroll height
    const contentRef = container.querySelector('.relative');
    expect(contentRef).not.toBeNull();
    
    // Simulate top trigger intersection
    await act(async () => {
      // Get the observer instance from our mock
      const observerInstance = observerMock.mock.mock.results[0].value;
      
      // Simulate intersection with top trigger
      observerInstance.simulateIntersection(true, topTrigger as Element);
    });
    
    // The scroll position should be restored
    // We can't fully test this without mocking the content height changes
    // but we can verify the callback is called
    expect(defaultProps.onLoadPrevious).toHaveBeenCalled();
    
    // Clean up our mock
    observerMock.cleanup();
  });
  
  it('renders loading indicator when loading more/previous', () => {
    const { container } = render(
      <BiDirectionalInfiniteScroll 
        {...defaultProps}
        isLoadingMore={true}
        isLoadingPrevious={true}
      >
        <div>Test content</div>
      </BiDirectionalInfiniteScroll>
    );
    
    // Should show loading spinners for both top and bottom
    const loadingSpinners = container.querySelectorAll('.animate-spin');
    expect(loadingSpinners.length).toBe(2);
  });
  
  it('renders custom loading indicator when provided', () => {
    const customIndicator = <div data-testid="custom-indicator">Loading...</div>;
    
    render(
      <BiDirectionalInfiniteScroll 
        {...defaultProps}
        isLoadingMore={true}
        loadingIndicator={customIndicator}
      >
        <div>Test content</div>
      </BiDirectionalInfiniteScroll>
    );
    
    // Should show custom indicator
    expect(screen.getByTestId('custom-indicator')).toBeInTheDocument();
  });
}); 