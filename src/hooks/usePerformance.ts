import { useEffect, useRef } from 'react';
import { performanceMonitor } from '../utils/performanceMonitoring';

interface UsePerformanceOptions {
  name: string;
  tags?: Record<string, string>;
  measureRender?: boolean;
  measureEffects?: boolean;
  measureInteractions?: boolean;
}

type InteractionMeasure = (interactionName: string) => () => void;

/**
 * Custom hook for measuring component performance
 */
export function usePerformance({
  name,
  tags = {},
  measureRender = true,
  measureEffects = true,
  measureInteractions = true
}: UsePerformanceOptions): InteractionMeasure {
  const mountTime = useRef(performance.now());
  const effectStartTime = useRef<number | null>(null);
  const interactionStartTimes = useRef<Map<string, number>>(new Map());

  // Measure mount time
  useEffect(() => {
    const mountDuration = performance.now() - mountTime.current;
    performanceMonitor.record(`${name}.mount`, mountDuration, 'ms', tags);

    return () => {
      // Measure unmount time
      const unmountStart = performance.now();
      requestAnimationFrame(() => {
        const unmountDuration = performance.now() - unmountStart;
        performanceMonitor.record(`${name}.unmount`, unmountDuration, 'ms', tags);
      });
    };
  }, []);

  // Measure effect time
  useEffect(() => {
    if (!measureEffects) return;

    effectStartTime.current = performance.now();

    return () => {
      if (effectStartTime.current) {
        const effectDuration = performance.now() - effectStartTime.current;
        performanceMonitor.record(`${name}.effect`, effectDuration, 'ms', tags);
      }
    };
  });

  // Measure render time
  if (measureRender) {
    const renderStart = performance.now();
    requestAnimationFrame(() => {
      const renderDuration = performance.now() - renderStart;
      performanceMonitor.record(`${name}.render`, renderDuration, 'ms', tags);
    });
  }

  // Create interaction measurement functions
  const measureInteraction = (interactionName: string) => {
    if (!measureInteractions) return () => {};

    const startTime = performance.now();
    interactionStartTimes.current.set(interactionName, startTime);

    return () => {
      const endTime = performance.now();
      const startTimeValue = interactionStartTimes.current.get(interactionName);
      
      if (startTimeValue) {
        const duration = endTime - startTimeValue;
        performanceMonitor.record(
          `${name}.interaction.${interactionName}`,
          duration,
          'ms',
          tags
        );
        interactionStartTimes.current.delete(interactionName);
      }
    };
  };

  return measureInteraction;
}

/**
 * HOC that wraps a component with performance measurements
 */
export function withPerformance<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<UsePerformanceOptions, 'name'>
): React.FC<P> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const WithPerformance: React.FC<P> = (props) => {
    usePerformance({
      name: displayName,
      ...options
    });

    return <WrappedComponent {...props} />;
  };

  WithPerformance.displayName = `WithPerformance(${displayName})`;
  return WithPerformance;
} 