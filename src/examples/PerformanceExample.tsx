import React from 'react';
import { OptimizedRoute } from '../components/OptimizedRoute';
import { useResourceHints } from '../hooks/useResourceHints';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';

// Example of a lazy-loaded component
const LazyComponent = () => import('../components/LazyExample');

// Example of a loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary" />
  </div>
);

// Example of an error component
const ErrorComponent = ({ error }: { error: Error }) => (
  <div className="flex flex-col items-center justify-center p-8 text-error">
    <h2 className="text-xl font-bold mb-2">Error Loading Component</h2>
    <p className="text-sm">{error.message}</p>
  </div>
);

/**
 * Example component demonstrating performance optimizations
 */
export function PerformanceExample() {
  const metrics = usePerformanceMetrics({
    componentName: 'PerformanceExample'
  });

  const { addHint } = useResourceHints({
    // Preload critical resources
    preload: [
      {
        url: '/assets/critical-image.jpg',
        as: 'image',
        crossOrigin: 'anonymous',
        type: 'preload'
      },
      {
        url: '/assets/main.css',
        as: 'style',
        type: 'preload'
      }
    ],
    // Prefetch resources that might be needed soon
    prefetch: [
      {
        url: '/api/data.json',
        as: 'fetch',
        crossOrigin: 'anonymous',
        type: 'prefetch'
      }
    ],
    // Preconnect to external domains
    preconnect: [
      {
        url: 'https://api.example.com',
        crossOrigin: 'anonymous',
        type: 'preconnect'
      }
    ],
    // DNS prefetch for domains we'll need later
    dnsPrefetch: [
      {
        url: 'https://images.example.com',
        type: 'dns-prefetch'
      }
    ]
  });

  // Example of measuring a user interaction
  const handleClick = async () => {
    await metrics.measureInteraction('button-click', async () => {
      // Simulate some async work
      await new Promise(resolve => setTimeout(resolve, 100));

      // Add a new resource hint dynamically
      addHint({
        url: '/assets/dynamic-resource.js',
        type: 'prefetch',
        as: 'script'
      });
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Performance Example</h1>

      <button
        onClick={handleClick}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
      >
        Trigger Interaction
      </button>

      <div className="mt-8">
        <OptimizedRoute
          component={LazyComponent}
          resources={{
            preload: [
              {
                url: '/assets/lazy-component.css',
                as: 'style',
                type: 'preload'
              }
            ],
            prefetch: [
              {
                url: '/assets/lazy-component-image.jpg',
                as: 'image',
                type: 'prefetch'
              }
            ]
          }}
          loading={LoadingComponent}
          error={ErrorComponent}
          componentProps={{
            title: 'Lazy Loaded Component'
          }}
        />
      </div>
    </div>
  );
} 