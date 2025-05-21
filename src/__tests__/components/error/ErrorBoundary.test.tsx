import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { GlobalErrorBoundary } from '../../../components/error/GlobalErrorBoundary';
import { AsyncErrorBoundary } from '../../../components/error/AsyncErrorBoundary';

// Mock console.error to prevent test output noise
const originalError = console.error;
const originalLog = console.log;
beforeAll(() => {
  console.error = (...args) => {
    // Allow some console.error messages to help with debugging
    if (typeof args[0] === 'string' && args[0].includes('Test diagnostics:')) {
      originalError.apply(console, args);
    }
  };
  console.log = (...args) => {
    // Allow logging during testing
    originalLog.apply(console, args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.log = originalLog;
});

// Mock ErrorMessage component
jest.mock('../../../blog/components/error/ErrorMessage', () => ({
  ErrorMessage: ({ title, message, onRetry }: { title: string; message: string; onRetry?: () => void }) => (
    <div data-testid="error-message">
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  )
}));

// Mock LoadingOverlay component
jest.mock('../../../components/loading/LoadingOverlay', () => ({
  LoadingOverlay: ({ 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showMessage 
  }: { 
    showMessage?: boolean 
  }) => (
    <div data-testid="loading-overlay">
      <p>Loading...</p>
    </div>
  )
}));

describe('Error Boundary Components', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('GlobalErrorBoundary', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    it('catches and displays errors', () => {
      render(
        <GlobalErrorBoundary>
          <ErrorComponent />
        </GlobalErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(/test error/i)).toBeInTheDocument();
      // Update this to match the actual button text in the component
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('resets error state on retry', () => {
      let shouldError = true;
      const ConditionalError = () => {
        if (shouldError) {
          throw new Error('Test error');
        }
        return <div>Success</div>;
      };

      render(
        <GlobalErrorBoundary>
          <ConditionalError />
        </GlobalErrorBoundary>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

      shouldError = false;
      // Update this to match the actual button text in the component
      fireEvent.click(screen.getByRole('button', { name: /try again/i }));

      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });

  describe('AsyncErrorBoundary', () => {
    it('handles async errors', () => {
      // Use custom loading fallback to avoid relying on LoadingOverlay implementation
      render(
        <AsyncErrorBoundary 
          loadingFallback={<div data-testid="loading-indicator">Loading...</div>}
        >
          {/* Simulate component that suspends */}
          <React.Suspense fallback={<div data-testid="loading-indicator">Loading...</div>}>
            <ErrorComponent />
          </React.Suspense>
        </AsyncErrorBoundary>
      );

      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('displays error UI for rejected promises', async () => {
      const AsyncErrorComponent = () => {
        throw new Error('Async error');
      };

      render(
        <AsyncErrorBoundary>
          <AsyncErrorComponent />
        </AsyncErrorBoundary>
      );

      // Wait for error UI to appear
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      });
      
      // Check that the error message includes our error text
      const errorElement = screen.getByTestId('error-message');
      expect(errorElement).toHaveTextContent(/an error occurred/i);
      expect(errorElement).toHaveTextContent(/async error/i);
    });

    it('supports custom error fallback', () => {
      const CustomFallback = ({ error }: { error: Error }) => (
        <div data-testid="custom-fallback">Custom error: {error.message}</div>
      );

      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <AsyncErrorBoundary fallback={<CustomFallback error={new Error('Test error')} />}>
          <ErrorComponent />
        </AsyncErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText(/custom error: test error/i)).toBeInTheDocument();
    });

    it('supports custom error handling', () => {
      const handleError = jest.fn();
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      render(
        <AsyncErrorBoundary 
          loadingFallback={<div>Loading...</div>} 
          onError={handleError}
        >
          <ErrorComponent />
        </AsyncErrorBoundary>
      );

      expect(handleError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object)
      );
    });
  });
});

// Helper component for the AsyncErrorBoundary test
const ErrorComponent = () => {
  React.useEffect(() => {
    throw new Promise(() => {}); // Simulate suspended component
  }, []);
  return null;
}; 