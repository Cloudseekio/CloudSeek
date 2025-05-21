import React from 'react';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';

interface LazyExampleProps {
  title: string;
}

/**
 * Example of a lazy-loaded component with performance monitoring
 */
export default function LazyExample({ title }: LazyExampleProps) {
  const metrics = usePerformanceMetrics({
    componentName: 'LazyExample'
  });

  const handleClick = () => {
    metrics.measureInteraction('example-click', async () => {
      // Simulate some async work
      await new Promise(resolve => setTimeout(resolve, 100));
    });
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">
        This component was lazy-loaded and includes performance monitoring.
      </p>
      <button
        onClick={handleClick}
        className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-dark"
      >
        Trigger Monitored Interaction
      </button>
    </div>
  );
} 