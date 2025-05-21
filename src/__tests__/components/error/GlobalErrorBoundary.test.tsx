import React from 'react';
import { render, screen } from '@testing-library/react';
import { GlobalErrorBoundary } from '../../../components/error/GlobalErrorBoundary';

// Mock ErrorMessage component
jest.mock('../../../blog/components/error/ErrorMessage', () => ({
  ErrorMessage: ({ 
    title, 
    message 
  }: { 
    title: string; 
    message: string; 
  }) => (
    <div data-testid="error-message">
      <h2>{title}</h2>
      <p>{message}</p>
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

describe('GlobalErrorBoundary', () => {
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
      <GlobalErrorBoundary>
        <div>Test Content</div>
      </GlobalErrorBoundary>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders error UI when a component throws an error', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };
    
    render(
      <GlobalErrorBoundary>
        <ErrorComponent />
      </GlobalErrorBoundary>
    );
    
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('An error occurred.')).toBeInTheDocument();
  });

  it('shows generic error message for application errors', () => {
    const ErrorComponent = () => {
      throw new Error('Application crashed');
    };
    
    render(
      <GlobalErrorBoundary>
        <ErrorComponent />
      </GlobalErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText('Please try refreshing the page.')).toBeInTheDocument();
  });
}); 