import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useBlog } from '../hooks/useBlog';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import RealTimeMetrics from '../components/analytics/RealTimeMetrics';
import ContentOptimizer from '../components/analytics/ContentOptimizer';

const AnalyticsDashboardPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  const { posts, authors, isLoading, error } = useBlog();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Failed to load analytics data
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Analytics Dashboard
        </h1>
        <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Monitor and optimize your blog's performance
        </p>
      </div>

      {/* Real-time Metrics */}
      <div className="mb-12">
        <RealTimeMetrics className="mb-8" />
      </div>

      {/* Overall Analytics */}
      <div className="mb-12">
        <AnalyticsDashboard
          posts={posts}
          authors={authors}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      {/* Content Optimization */}
      {posts.length > 0 && (
        <div className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Content Optimization
          </h2>
          <div className="space-y-8">
            {posts.slice(0, 3).map(post => (
              <ContentOptimizer
                key={post.id}
                post={post}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboardPage; 