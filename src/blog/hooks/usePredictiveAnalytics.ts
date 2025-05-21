import { useState, useEffect } from 'react';
import { BlogPost } from '../../models/Blog';
import { predictiveAnalytics } from '../services/predictiveAnalytics';
import type { 
  ContentPrediction, 
  ContentOptimizationResult, 
  ContentRecommendation 
} from '../services/predictiveAnalytics';

interface UsePredictiveAnalyticsOptions {
  post: BlogPost;
  autoOptimize?: boolean;
}

interface PredictiveAnalyticsState {
  prediction: ContentPrediction | null;
  optimization: ContentOptimizationResult | null;
  isLoading: boolean;
  error: Error | null;
}

export function usePredictiveAnalytics({
  post,
  autoOptimize = false
}: UsePredictiveAnalyticsOptions) {
  const [state, setState] = useState<PredictiveAnalyticsState>({
    prediction: null,
    optimization: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    const analyze = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Get content prediction
        const prediction = await predictiveAnalytics.predictPerformance(post);

        // Get optimization if requested
        let optimization = null;
        if (autoOptimize) {
          optimization = await predictiveAnalytics.optimizeContent(post);
        }

        if (mounted) {
          setState({
            prediction,
            optimization,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        if (mounted) {
          setState({
            prediction: null,
            optimization: null,
            isLoading: false,
            error: error instanceof Error ? error : new Error('Failed to analyze content')
          });
        }
      }
    };

    analyze();

    return () => {
      mounted = false;
    };
  }, [post, autoOptimize]);

  const optimizeContent = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const optimization = await predictiveAnalytics.optimizeContent(post);
      setState(prev => ({ ...prev, optimization, isLoading: false }));
      return optimization;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to optimize content')
      }));
      throw error;
    }
  };

  const getTopRecommendations = (priority?: 'high' | 'medium' | 'low'): ContentRecommendation[] => {
    if (!state.optimization?.improvements) return [];

    const improvements = [...state.optimization.improvements];
    
    if (priority) {
      return improvements.filter(imp => imp.priority === priority);
    }

    // Sort by expected impact
    return improvements.sort((a, b) => b.expectedImpact - a.expectedImpact);
  };

  const getPriorityRecommendations = (): {
    high: ContentRecommendation[];
    medium: ContentRecommendation[];
    low: ContentRecommendation[];
  } => {
    const improvements = state.optimization?.improvements || [];
    
    return {
      high: improvements.filter(imp => imp.priority === 'high'),
      medium: improvements.filter(imp => imp.priority === 'medium'),
      low: improvements.filter(imp => imp.priority === 'low')
    };
  };

  const getScoreImprovement = (): number => {
    if (!state.optimization) return 0;
    return state.optimization.optimizedScore - state.optimization.originalScore;
  };

  const getOptimizationSummary = () => {
    if (!state.optimization) return null;

    const improvement = getScoreImprovement();
    const recommendations = getPriorityRecommendations();

    return {
      currentScore: state.optimization.originalScore,
      potentialScore: state.optimization.optimizedScore,
      improvement,
      improvementPercentage: (improvement / state.optimization.originalScore) * 100,
      recommendationCount: state.optimization.improvements.length,
      highPriorityCount: recommendations.high.length,
      predictedViews: state.optimization.predictedMetrics.views,
      predictedEngagement: state.optimization.predictedMetrics.engagement,
      predictedConversion: state.optimization.predictedMetrics.conversionRate
    };
  };

  return {
    ...state,
    optimizeContent,
    getTopRecommendations,
    getPriorityRecommendations,
    getScoreImprovement,
    getOptimizationSummary
  };
} 