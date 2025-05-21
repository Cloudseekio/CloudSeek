import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { LoadingGuard } from '../../../components/loading/LoadingGuard';
import { LoadingProvider } from '../../../context/LoadingContext';
import { animationTestSetup, simulateTransitionEnd } from '../../../testUtils/animationMocks';

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LoadingProvider>
      {children}
    </LoadingProvider>
  );
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper });
};

describe('LoadingGuard', () => {
  // Use our animation test setup
  beforeEach(() => {
    animationTestSetup.beforeEach();
  });

  afterEach(() => {
    animationTestSetup.afterEach();
  });

  const TestContent = () => <div>Test Content</div>;

  it('renders children when not loading', () => {
    renderWithProviders(
      <LoadingGuard isLoading={false}>
        <TestContent />
      </LoadingGuard>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows loading overlay after minDelay when loading', () => {
    renderWithProviders(
      <LoadingGuard isLoading={true} minDelay={200}>
        <TestContent />
      </LoadingGuard>
    );

    // Initially, loading overlay should not be visible
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    // Advance timers by minDelay
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Loading overlay should now be visible
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows custom loading fallback when provided', () => {
    const CustomFallback = () => <div>Custom Loading</div>;

    renderWithProviders(
      <LoadingGuard 
        isLoading={true} 
        loadingFallback={<CustomFallback />}
      >
        <TestContent />
      </LoadingGuard>
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByText('Custom Loading')).toBeInTheDocument();
  });

  it('shows progress bar when showProgress is true', () => {
    renderWithProviders(
      <LoadingGuard 
        isLoading={true} 
        showProgress={true}
      >
        <TestContent />
      </LoadingGuard>
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });

    const progressText = screen.getByText(/loading \d+% complete/i);
    expect(progressText).toBeInTheDocument();
  });

  it('handles transition animations correctly', () => {
    const { container } = renderWithProviders(
      <LoadingGuard 
        isLoading={true}
        transitionDuration={300}
      >
        <TestContent />
      </LoadingGuard>
    );

    // Initial render
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Check for loading overlay with transition styles
    const overlay = container.querySelector('[role="status"]');
    expect(overlay).toBeInTheDocument();

    // Initial opacity should be 0
    expect(overlay).toHaveStyle({ opacity: '0' });

    // After transition duration
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Now opacity should be 1
    expect(overlay).toHaveStyle({ opacity: '1' });

    // Simulate transition end
    if (overlay) {
      simulateTransitionEnd(overlay, 'opacity');
    }
  });

  it('removes loading overlay when isLoading becomes false', () => {
    const { rerender } = renderWithProviders(
      <LoadingGuard 
        isLoading={true}
        transitionDuration={300}
      >
        <TestContent />
      </LoadingGuard>
    );

    // Show loading overlay
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByRole('status')).toBeInTheDocument();

    // Update isLoading to false
    rerender(
      <TestWrapper>
        <LoadingGuard 
          isLoading={false}
          transitionDuration={300}
        >
          <TestContent />
        </LoadingGuard>
      </TestWrapper>
    );

    // After transition duration, overlay should be removed
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    const { container } = renderWithProviders(
      <LoadingGuard 
        isLoading={true}
        className="custom-class"
      >
        <TestContent />
      </LoadingGuard>
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });

    const rootElement = container.firstChild as HTMLElement;
    expect(rootElement).toHaveClass('custom-class');
  });
}); 