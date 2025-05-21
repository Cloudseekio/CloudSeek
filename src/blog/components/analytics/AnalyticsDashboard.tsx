import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { BlogPost, Author } from '../../../models/Blog';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceMetrics {
  totalViews: number;
  uniqueViews: number;
  avgReadTime: number;
  totalEngagements: number;
  conversionRate: number;
  bounceRate: number;
  totalUniqueVisitors: number;
  avgTimeOnPage: number;
  topPosts: Array<{
    postId: string;
    title: string;
    views: number;
    engagement: number;
    conversionRate: number;
    engagementScore: number;
  }>;
  topAuthors: Array<{
    name: string;
    views: number;
    engagement: number;
  }>;
}

interface AnalyticsDashboardProps {
  posts: BlogPost[];
  authors: Author[];
  dateRange: 'day' | 'week' | 'month' | 'year';
  onDateRangeChange: (range: 'day' | 'week' | 'month' | 'year') => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  posts,
  authors,
  dateRange,
  onDateRangeChange
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const mockMetrics: PerformanceMetrics = {
        totalViews: 15000,
        uniqueViews: 12000,
        avgReadTime: 4.5,
        totalEngagements: 3200,
        conversionRate: 2.8,
        bounceRate: 25.5,
        totalUniqueVisitors: 8500,
        avgTimeOnPage: 3.2,
        topPosts: posts.slice(0, 5).map(post => ({
          postId: post.id,
          title: post.title,
          views: Math.floor(Math.random() * 1000),
          engagement: Math.floor(Math.random() * 100),
          conversionRate: Math.random() * 5,
          engagementScore: Math.random() * 100
        })),
        topAuthors: authors.slice(0, 5).map(author => ({
          name: author.name,
          views: Math.floor(Math.random() * 5000),
          engagement: Math.floor(Math.random() * 1000)
        }))
      };

      setPerformanceMetrics(mockMetrics);
    };

    fetchAnalytics();
  }, [posts, authors, dateRange]);

  if (!performanceMetrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  const chartData: ChartData<'line'> = {
    labels: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'Page Views',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000)),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      },
      {
        label: 'Unique Visitors',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 800)),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#e5e7eb' : '#374151'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDark ? '#e5e7eb' : '#374151'
        }
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDark ? '#e5e7eb' : '#374151'
        }
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Overall Analytics
        </h2>
        <div className="flex gap-2">
          {(['day', 'week', 'month', 'year'] as const).map(range => (
            <button
              key={range}
              onClick={() => onDateRangeChange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                dateRange === range
                  ? 'bg-blue-600 text-white'
                  : isDark
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
          <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Total Views
          </h3>
          <p className={`text-2xl font-semibold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {performanceMetrics.totalViews.toLocaleString()}
          </p>
        </div>
        <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
          <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Unique Visitors
          </h3>
          <p className={`text-2xl font-semibold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {performanceMetrics.totalUniqueVisitors.toLocaleString()}
          </p>
        </div>
        <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
          <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Avg. Time on Page
          </h3>
          <p className={`text-2xl font-semibold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {performanceMetrics.avgTimeOnPage.toFixed(2)} min
          </p>
        </div>
        <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
          <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Bounce Rate
          </h3>
          <p className={`text-2xl font-semibold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {performanceMetrics.bounceRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 