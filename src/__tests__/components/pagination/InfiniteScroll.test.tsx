import React from 'react';
import { render, screen } from '@testing-library/react';
import { InfiniteScroll } from '../../../components/pagination/InfiniteScroll';

// Define types for mock component props
interface PaginationBaseProps {
  children?: React.ReactNode;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

// Store the IntersectionObserver callback for later use in tests
let intersectionCallback: (entries: { isIntersecting: boolean }[]) => void;

// Mock PaginationBase component
jest.mock('../../../components/pagination/PaginationBase', () => ({
  PaginationBase: ({ 
    children, 
    hasNextPage, 
    onLoadMore, 
    loadingMore 
  }: PaginationBaseProps) => (
    <div data-testid="pagination-base">
      {hasNextPage && (
        <button 
          onClick={onLoadMore} 
          disabled={loadingMore}
          data-testid="load-more-button"
        >
          {loadingMore ? 'Loading...' : 'Load More'}
        </button>
      )}
      {children}
    </div>
  ),
}));

describe('InfiniteScroll', () => {
  const defaultProps = {
    totalItems: 100,
    currentPage: 1,
    onPageChange: jest.fn(),
    itemsPerPage: 10,
    onLoadMore: jest.fn(),
    hasNextPage: true,
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Set up IntersectionObserver mock
    mockIntersectionObserver.mockReset();
    mockObserve.mockReset();
    mockUnobserve.mockReset();
    mockDisconnect.mockReset();
    
    mockIntersectionObserver.mockImplementation(callback => {
      // Store the callback for use in tests
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      };
    });
    
    // Assign the mock to the global object
    global.IntersectionObserver = mockIntersectionObserver;
  });

  it('renders children content', () => {
    render(
      <InfiniteScroll {...defaultProps}>
        <div data-testid="test-content">Test Content</div>
      </InfiniteScroll>
    );
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('renders PaginationBase component', () => {
    render(
      <InfiniteScroll {...defaultProps}>
        <div>Test Content</div>
      </InfiniteScroll>
    );
    
    expect(screen.getByTestId('pagination-base')).toBeInTheDocument();
  });

  it('renders load more button when hasNextPage is true', () => {
    render(
      <InfiniteScroll {...defaultProps} hasNextPage={true}>
        <div>Test Content</div>
      </InfiniteScroll>
    );
    
    expect(screen.getByTestId('load-more-button')).toBeInTheDocument();
  });

  it('does not render load more button when hasNextPage is false', () => {
    render(
      <InfiniteScroll {...defaultProps} hasNextPage={false}>
        <div>Test Content</div>
      </InfiniteScroll>
    );
    
    expect(screen.queryByTestId('load-more-button')).not.toBeInTheDocument();
  });

  it('sets up an IntersectionObserver on load when hasNextPage is true', () => {
    render(
      <InfiniteScroll {...defaultProps} hasNextPage={true}>
        <div>Test Content</div>
      </InfiniteScroll>
    );
    
    expect(mockIntersectionObserver).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalled();
  });

  it('does not observe when hasNextPage is false', () => {
    render(
      <InfiniteScroll {...defaultProps} hasNextPage={false}>
        <div>Test Content</div>
      </InfiniteScroll>
    );
    
    // When hasNextPage is false, IntersectionObserver should not be created at all
    expect(mockIntersectionObserver).not.toHaveBeenCalled();
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('shows loading indicator when loadingMore is true', () => {
    render(
      <InfiniteScroll {...defaultProps} loadingMore={true}>
        <div>Test Content</div>
      </InfiniteScroll>
    );
    
    // The loading spinner should be in the document
    expect(screen.getByRole('button', { name: 'Loading...' })).toBeInTheDocument();
  });

  it('renders custom loading indicator', () => {
    render(
      <InfiniteScroll
        {...defaultProps}
        hasNextPage={true}
        loadingMore={true}
        loadingIndicator={<div data-testid="custom-loader">Custom Loader</div>}
      >
        <div>Test content</div>
      </InfiniteScroll>
    );
    
    expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
  });

  it('calls onLoadMore when loadingMore is false and hasNextPage is true', () => {
    const onLoadMore = jest.fn();
    
    render(
      <InfiniteScroll
        {...defaultProps}
        hasNextPage={true}
        loadingMore={false}
        onLoadMore={onLoadMore}
      >
        <div>Test content</div>
      </InfiniteScroll>
    );
    
    // Simulate intersection 
    expect(intersectionCallback).toBeDefined();
    intersectionCallback([{ isIntersecting: true }]);
    
    expect(onLoadMore).toHaveBeenCalled();
  });
  
  it('does not call onLoadMore when loadingMore is true', () => {
    const onLoadMore = jest.fn();
    
    render(
      <InfiniteScroll
        {...defaultProps}
        hasNextPage={true}
        loadingMore={true}
        onLoadMore={onLoadMore}
      >
        <div>Test content</div>
      </InfiniteScroll>
    );
    
    // Simulate intersection
    expect(intersectionCallback).toBeDefined();
    intersectionCallback([{ isIntersecting: true }]);
    
    expect(onLoadMore).not.toHaveBeenCalled();
  });
  
  it('does not call onLoadMore when hasNextPage is false', () => {
    const onLoadMore = jest.fn();
    
    render(
      <InfiniteScroll
        {...defaultProps}
        hasNextPage={false}
        loadingMore={false}
        onLoadMore={onLoadMore}
      >
        <div>Test content</div>
      </InfiniteScroll>
    );
    
    // Simulate intersection (although observe isn't called, we still test the callback behavior)
    expect(intersectionCallback).toBeDefined();
    intersectionCallback([{ isIntersecting: true }]);
    
    expect(onLoadMore).not.toHaveBeenCalled();
  });
  
  it('does not call onLoadMore when not intersecting', () => {
    const onLoadMore = jest.fn();
    
    render(
      <InfiniteScroll
        {...defaultProps}
        hasNextPage={true}
        loadingMore={false}
        onLoadMore={onLoadMore}
      >
        <div>Test content</div>
      </InfiniteScroll>
    );
    
    // Simulate non-intersection
    expect(intersectionCallback).toBeDefined();
    intersectionCallback([{ isIntersecting: false }]);
    
    expect(onLoadMore).not.toHaveBeenCalled();
  });
}); 