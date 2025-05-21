import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { initializeEnvironment } from './config/environment';
import { GlobalErrorBoundary } from './components/error/GlobalErrorBoundary';
import logger from './utils/logger';
import { setupCriticalResourceHints } from './utils/resourceHints';
import { initializePerformanceMonitoring } from './utils/performanceIntegration';

// Check if we're in a browser environment before initializing browser-specific features
const isBrowser = typeof window !== 'undefined' && window.document;

// Initialize performance monitoring
if (isBrowser) {
  try {
    initializePerformanceMonitoring({
      debug: process.env.NODE_ENV === 'development',
      monitor: {
        enabled: true,
        sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1, // Full sampling in dev
      },
      analytics: {
        enabled: process.env.NODE_ENV === 'production', // Only in production
      }
    });
    logger.info('Performance monitoring initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize performance monitoring:', error);
  }

  // Initialize resource hints for critical assets
  try {
    // Setup initial critical resource hints immediately
    setupCriticalResourceHints();
    logger.info('Resource hints initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize resource hints:', error);
  }

  // Initialize environment
  try {
    initializeEnvironment();
    logger.info('Environment initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize environment:', error);
    throw error;
  }
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Only run this code in the browser
if (isBrowser) {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <GlobalErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <App />
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </GlobalErrorBoundary>
      </StrictMode>
    );
  }
} else {
  // Handle non-browser environment (e.g., for SSR if needed)
  console.warn('Non-browser environment detected. Skipping React DOM rendering.');
}
