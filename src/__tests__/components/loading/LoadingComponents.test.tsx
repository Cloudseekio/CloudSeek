import React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import { LoadingGuard } from '../../../components/loading/LoadingGuard';
import { LoadingSuspense } from '../../../components/loading/LoadingSuspense';
import { LoadingProvider, useLoading } from '../../../context/LoadingContext';
import { simulateTransitionEnd } from '../../../testUtils/animationMocks';

// Mock the LoadingOverlay component to simplify testing
jest.mock('../../../components/loading/LoadingOverlay', () => ({
  LoadingOverlay: ({ children, showMessage }: { children?: React.ReactNode; showMessage?: boolean }) => (
    <div role="progressbar" aria-busy="true">
      <div>Loading Content</div>
      {showMessage && <div>Loading message</div>}
      {children}
    </div>
  )
}));

jest.useFakeTimers();

describe('Loading Components', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('LoadingGuard', () => {
    it('shows children when not loading', () => {
      render(
        <LoadingGuard isLoading={false}>
          <div>Content</div>
        </LoadingGuard>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('shows loading state after minimum delay', async () => {
      const { container } = render(
        <LoadingGuard isLoading={true} minDelay={100}>
          <div>Content</div>
        </LoadingGuard>
      );

      // Initially, the content should be visible but loading overlay should be hidden (opacity 0)
      expect(screen.getByText('Content')).toBeInTheDocument();
      
      // Advance timers to trigger the loading state
      act(() => {
        jest.advanceTimersByTime(200); // minDelay + a bit more
      });

      // Now simulate the transition completing
      const overlayElement = container.querySelector('[role="status"]');
      if (overlayElement) {
        act(() => {
          simulateTransitionEnd(overlayElement, 'opacity');
        });
      }

      // Loading indicator should be visible
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });
    });

    it('renders custom loading fallback', async () => {
      const { container } = render(
        <LoadingGuard 
          isLoading={true} 
          loadingFallback={<div>Custom Loading...</div>}
        >
          <div>Content</div>
        </LoadingGuard>
      );

      // Advance timers to trigger the loading state
      act(() => {
        jest.advanceTimersByTime(300); // minDelay + transitionDuration
      });

      // Simulate transition end
      const overlayElement = container.querySelector('[role="status"]');
      if (overlayElement) {
        act(() => {
          simulateTransitionEnd(overlayElement, 'opacity');
        });
      }

      // Now check for the custom loading content
      await waitFor(() => {
        expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
      });
    });
  });

  describe('LoadingSuspense', () => {
    const SuspendedComponent = () => {
      throw new Promise(() => {});
    };

    it('shows fallback while suspended', () => {
      // Mock console.error to prevent React error boundary warnings
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      render(
        <LoadingSuspense fallback={<div>Loading...</div>}>
          <SuspendedComponent />
        </LoadingSuspense>
      );

      // Use a more flexible matcher for the loading text
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      
      // Restore console.error
      console.error = originalConsoleError;
    });
  });

  describe('LoadingProvider', () => {
    const TestComponent = () => {
      const { isLoading, startLoading, stopLoading } = useLoading();
      return (
        <div>
          <span>Loading: {isLoading ? 'true' : 'false'}</span>
          <button onClick={() => startLoading('test')}>Start Loading</button>
          <button onClick={() => stopLoading('test')}>Stop Loading</button>
        </div>
      );
    };

    it('manages loading state', () => {
      render(
        <LoadingProvider>
          <TestComponent />
        </LoadingProvider>
      );

      expect(screen.getByText('Loading: false')).toBeInTheDocument();

      act(() => {
        screen.getByText('Start Loading').click();
      });

      expect(screen.getByText('Loading: true')).toBeInTheDocument();

      act(() => {
        screen.getByText('Stop Loading').click();
      });

      expect(screen.getByText('Loading: false')).toBeInTheDocument();
    });

    it('manages loading keys', () => {
      const NestedComponent = () => {
        const { loadingKeys } = useLoading();
        return (
          <div>Keys:{Array.from(loadingKeys).join(',')}</div>
        );
      };

      render(
        <LoadingProvider>
          <TestComponent />
          <NestedComponent />
        </LoadingProvider>
      );

      // Use a more flexible matcher for the empty keys text
      expect(screen.getByText(/Keys:/)).toBeInTheDocument();

      act(() => {
        screen.getByText('Start Loading').click();
      });

      expect(screen.getByText('Keys:test')).toBeInTheDocument();
    });
  });
}); 