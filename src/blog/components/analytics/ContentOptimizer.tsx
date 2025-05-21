import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BarChart2,
  Target
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { BlogPost } from '../../../models/Blog';
import { usePredictiveAnalytics } from '../../hooks/usePredictiveAnalytics';
import type { ContentRecommendation } from '../../services/predictiveAnalytics';

interface ContentOptimizerProps {
  post: BlogPost;
  className?: string;
}

const ContentOptimizer: React.FC<ContentOptimizerProps> = ({ post, className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const {
    isLoading,
    error,
    getTopRecommendations,
    getOptimizationSummary
  } = usePredictiveAnalytics({
    post,
    autoOptimize: true
  });

  if (isLoading) {
    return (
      <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow ${className}`}>
        <div className="flex items-center text-red-500 mb-4">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>Failed to analyze content</span>
        </div>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {error.message}
        </p>
      </div>
    );
  }

  const summary = getOptimizationSummary();
  if (!summary) return null;

  const recommendations = getTopRecommendations();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Score Overview */}
      <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Content Optimization Score
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScoreCard
            title="Current Score"
            value={summary.currentScore}
            icon={<BarChart2 className="w-5 h-5" />}
            isDark={isDark}
          />
          <ScoreCard
            title="Potential Score"
            value={summary.potentialScore}
            icon={<Target className="w-5 h-5" />}
            isDark={isDark}
            highlight={true}
          />
          <ScoreCard
            title="Improvement"
            value={`+${summary.improvement}`}
            subtext={`${summary.improvementPercentage.toFixed(1)}%`}
            icon={<TrendingUp className="w-5 h-5" />}
            isDark={isDark}
          />
        </div>
      </div>

      {/* Recommendations */}
      <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Optimization Recommendations
          </h2>
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {summary.recommendationCount} suggestions
          </span>
        </div>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={index}
              recommendation={recommendation}
              isDark={isDark}
            />
          ))}
        </div>
      </div>

      {/* Predicted Metrics */}
      <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Predicted Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Predicted Views"
            value={summary.predictedViews.toLocaleString()}
            icon={<TrendingUp className="w-5 h-5" />}
            isDark={isDark}
          />
          <MetricCard
            title="Engagement Rate"
            value={`${(summary.predictedEngagement * 100).toFixed(1)}%`}
            icon={<Target className="w-5 h-5" />}
            isDark={isDark}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${(summary.predictedConversion * 100).toFixed(1)}%`}
            icon={<CheckCircle className="w-5 h-5" />}
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
};

interface ScoreCardProps {
  title: string;
  value: number | string;
  subtext?: string;
  icon: React.ReactNode;
  isDark: boolean;
  highlight?: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ 
  title, 
  value, 
  subtext, 
  icon, 
  isDark,
  highlight = false 
}) => (
  <div className={`p-4 rounded-lg ${
    highlight
      ? isDark ? 'bg-blue-900/20' : 'bg-blue-50'
      : isDark ? 'bg-gray-700/50' : 'bg-gray-50'
  }`}>
    <div className="flex items-center justify-between mb-2">
      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {title}
      </span>
      <div className={highlight 
        ? isDark ? 'text-blue-400' : 'text-blue-600'
        : isDark ? 'text-gray-400' : 'text-gray-500'
      }>
        {icon}
      </div>
    </div>
    <div className="flex items-baseline">
      <span className={`text-2xl font-semibold ${
        highlight
          ? isDark ? 'text-blue-400' : 'text-blue-600'
          : isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {value}
      </span>
      {subtext && (
        <span className={`ml-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {subtext}
        </span>
      )}
    </div>
  </div>
);

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  isDark: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, isDark }) => (
  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
    <div className="flex items-center justify-between mb-2">
      <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {title}
      </span>
      <div className={isDark ? 'text-gray-400' : 'text-gray-500'}>
        {icon}
      </div>
    </div>
    <span className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {value}
    </span>
  </div>
);

interface RecommendationCardProps {
  recommendation: ContentRecommendation;
  isDark: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, isDark }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return isDark ? 'text-red-400' : 'text-red-600';
      case 'medium':
        return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'low':
        return isDark ? 'text-green-400' : 'text-green-600';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center">
            <span className={`text-sm font-medium capitalize ${getPriorityColor(recommendation.priority)}`}>
              {recommendation.priority} Priority
            </span>
            <span className={`mx-2 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {recommendation.type.replace('_', ' ')}
            </span>
          </div>
          <p className={`text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {recommendation.suggestion}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {recommendation.reasoning}
          </p>
        </div>
        <span className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>
          +{recommendation.expectedImpact}%
        </span>
      </div>
    </div>
  );
};

export default ContentOptimizer; 