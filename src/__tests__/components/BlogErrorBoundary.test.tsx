import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BlogErrorBoundary } from '../../blog/components/error/BlogErrorBoundary';

describe('BlogErrorBoundary', () => {
  const originalConsoleError = console.error;
  
  beforeAll(() => {
    // Suppress console.error for cleaner test output
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('renders children when there is no error', () => {
    render(
      <BlogErrorBoundary>
        <div>Test Content</div>
      </BlogErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders error UI when an error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <BlogErrorBoundary>
        <ThrowError />
      </BlogErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('shows retry button and handles retry attempts', async () => {
    let shouldThrow = true;
    const ToggleError = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>Success</div>;
    };

    render(
      <BlogErrorBoundary>
        <ToggleError />
      </BlogErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();

    // Simulate successful retry
    shouldThrow = false;
    await act(async () => {
      retryButton.click();
    });

    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('respects maxRetries prop', async () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <BlogErrorBoundary maxRetries={2}>
        <ThrowError />
      </BlogErrorBoundary>
    );

    const retryButton = screen.getByRole('button', { name: /try again/i });

    // First retry
    await act(async () => {
      retryButton.click();
    });

    // Second retry
    await act(async () => {
      retryButton.click();
    });

    // Button should be disabled after max retries
    expect(retryButton).toBeDisabled();
  });

  it('uses custom fallback component when provided', () => {
    const CustomFallback = () => <div>Custom Error UI</div>;
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <BlogErrorBoundary fallback={<CustomFallback />}>
        <ThrowError />
      </BlogErrorBoundary>
    );

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
  });

  it('handles async errors in children', async () => {
    const AsyncError = () => {
      React.useEffect(() => {
        throw new Error('Async error');
      }, []);
      return null;
    };

    render(
      <BlogErrorBoundary>
        <AsyncError />
      </BlogErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });
}); 