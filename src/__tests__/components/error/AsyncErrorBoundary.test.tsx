import React from 'react';
import { render, screen } from '@testing-library/react';
import { AsyncErrorBoundary } from '../../../components/error/AsyncErrorBoundary';

// Mock ErrorMessage component
jest.mock('../../../blog/components/error/ErrorMessage', () => ({
  ErrorMessage: ({ 
    title, 
    message, 
    onRetry 
  }: { 
    title: string; 
    message: string; 
    onRetry?: () => void 
  }) => (
    <div data-testid="error-message">
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  )
}));

// Mock LoadingOverlay component
jest.mock('../../../components/loading/LoadingOverlay', () => ({
  LoadingOverlay: () => (
    <div data-testid="loading-overlay">
      <p>Loading...</p>
    </div>
  )
}));

// Mock logger to avoid console spam during tests
jest.mock('../../../utils/logger', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn()
  }
}));

// Mock isRetryableError
jest.mock('../../../utils/errorUtils', () => ({
  isRetryableError: jest.fn().mockReturnValue(true)
}));

describe('AsyncErrorBoundary', () => {
  const originalConsoleError = console.error;
  
  beforeAll(() => {
    // Suppress React error boundary console errors during testing
    console.error = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalConsoleError;
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <AsyncErrorBoundary>
        <div>Test Content</div>
      </AsyncErrorBoundary>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows a custom loading fallback when provided', () => {
    // Create a component that renders the loading state
    const LoadingTestComponent = () => {
      // Force the component to be in a loading state
      throw new Promise(() => {});
      // This line is never reached
      return <div>Test Content</div>;
    };
    
    // Mock the AsyncErrorBoundary's internal state to show loading
    const originalUseState = React.useState;
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [
      { isPending: true, error: null },
      jest.fn()
    ]);
    
    render(
      <AsyncErrorBoundary 
        loadingFallback={<div data-testid="custom-loading">Custom Loading...</div>}
      >
        <LoadingTestComponent />
      </AsyncErrorBoundary>
    );
    
    // Restore the original useState implementation
    React.useState = originalUseState;
    
    // Check for the custom loading element
    expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
  });

  it('renders error UI when a component throws an error', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };
    
    render(
      <AsyncErrorBoundary>
        <ErrorComponent />
      </AsyncErrorBoundary>
    );
    
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('supports custom error fallback', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };
    
    const CustomFallback = () => (
      <div data-testid="custom-error-fallback">
        Custom Error Handling
      </div>
    );
    
    render(
      <AsyncErrorBoundary fallback={<CustomFallback />}>
        <ErrorComponent />
      </AsyncErrorBoundary>
    );
    
    expect(screen.getByTestId('custom-error-fallback')).toBeInTheDocument();
  });

  it('calls onError handler when an error occurs', () => {
    const handleError = jest.fn();
    
    const ErrorComponent = () => {
      throw new Error('Test error');
    };
    
    render(
      <AsyncErrorBoundary onError={handleError}>
        <ErrorComponent />
      </AsyncErrorBoundary>
    );
    
    expect(handleError).toHaveBeenCalled();
  });
}); 