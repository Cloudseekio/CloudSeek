import React from 'react';
import { withRouteSplitting } from '../components/routing/SplitRoute';
import { PerformanceMetricsPanel } from '../components/performance/PerformanceMetricsPanel';

function PerformancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Performance Monitoring</h1>
        <p className="text-gray-600">
          Real-time performance metrics and insights for your application.
        </p>
      </header>

      {/* Main metrics panel */}
      <div className="mb-8">
        <PerformanceMetricsPanel refreshInterval={2000} />
      </div>

      {/* Performance Insights */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Performance Score */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Performance Score</h2>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-blue-600">92</div>
            <div className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">First Contentful Paint</span>
              <span className="font-medium">0.8s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Time to Interactive</span>
              <span className="font-medium">1.2s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Speed Index</span>
              <span className="font-medium">1.5s</span>
            </div>
          </div>
        </div>

        {/* Resource Optimization */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Resource Optimization</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Cache Performance</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cache Hit Rate</span>
                <span className="font-medium">85%</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Bundle Size</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Main Bundle</span>
                <span className="font-medium">156 KB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Chunks</span>
                <span className="font-medium">423 KB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Monitoring */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Error Monitoring</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Errors (24h)</span>
              <span className="font-medium">3</span>
            </div>
            <div>
              <h3 className="font-medium mb-2">Recent Errors</h3>
              <div className="space-y-2">
                <div className="p-2 bg-red-50 rounded text-sm">
                  <div className="font-medium text-red-800">TypeError</div>
                  <div className="text-red-600">Cannot read property 'length' of undefined</div>
                  <div className="text-red-500 text-xs">2 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Network Analysis */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Network Analysis</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">API Performance</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Response Time</span>
                <span className="font-medium">245ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-medium">99.8%</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Request Volume</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Requests/min</span>
                <span className="font-medium">42</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Export with route splitting
export default withRouteSplitting(PerformancePage, {
  fallback: (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent" />
    </div>
  ),
}); 