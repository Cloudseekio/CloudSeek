interface PerformanceEntry {
  duration: number;
  startTime: number;
  name: string;
}

interface AnimationMetrics {
  averageFrameTime: number;
  droppedFrames: number;
  totalDuration: number;
}

type CSSPropertyName = keyof CSSStyleDeclaration;

/**
 * Measures the performance of animations by tracking frame times
 */
export function measureAnimationPerformance(
  callback: () => void,
  duration: number = 1000
): Promise<AnimationMetrics> {
  return new Promise((resolve) => {
    const frames: number[] = [];
    const startTime = performance.now();
    let rafId: number;

    function frame(timestamp: number) {
      frames.push(timestamp);
      if (timestamp - startTime < duration) {
        rafId = requestAnimationFrame(frame);
      } else {
        // Calculate metrics
        const frameTimes = frames.slice(1).map((t, i) => t - frames[i]);
        const averageFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
        const droppedFrames = frameTimes.filter(t => t > 16.67).length; // Frames longer than 60fps
        
        resolve({
          averageFrameTime,
          droppedFrames,
          totalDuration: timestamp - startTime
        });
      }
    }

    // Start measuring and trigger the animation
    rafId = requestAnimationFrame(frame);
    callback();

    // Cleanup
    return () => cancelAnimationFrame(rafId);
  });
}

/**
 * Checks if animations are performing within acceptable thresholds
 */
export function isAnimationPerformanceAcceptable(metrics: AnimationMetrics): boolean {
  return (
    metrics.averageFrameTime < 16.67 && // 60fps
    metrics.droppedFrames / (metrics.totalDuration / 16.67) < 0.1 // Less than 10% dropped frames
  );
}

/**
 * Measures the smoothness of a CSS transition
 */
export function measureTransitionSmoothness(
  element: HTMLElement,
  propertyName: CSSPropertyName,
  startValue: string,
  endValue: string,
  duration: number
): Promise<AnimationMetrics> {
  return new Promise((resolve) => {
    const samples: PerformanceEntry[] = [];
    const observer = new PerformanceObserver((list) => {
      samples.push(...list.getEntries());
    });

    observer.observe({ entryTypes: ['element'] });

    // Start transition
    element.style.transition = `${propertyName} ${duration}ms`;
    element.style[propertyName] = startValue;

    requestAnimationFrame(() => {
      element.style[propertyName] = endValue;
    });

    // Cleanup and calculate metrics after transition
    setTimeout(() => {
      observer.disconnect();
      const frameTimes = samples.map(s => s.duration);
      
      resolve({
        averageFrameTime: frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length,
        droppedFrames: frameTimes.filter(t => t > 16.67).length,
        totalDuration: samples[samples.length - 1].startTime - samples[0].startTime
      });
    }, duration + 100);
  });
}

/**
 * Creates a test case for animation performance
 */
export function createAnimationTest(
  description: string,
  callback: () => void,
  expectedMetrics: Partial<AnimationMetrics>
) {
  return async () => {
    const metrics = await measureAnimationPerformance(callback);
    
    Object.entries(expectedMetrics).forEach(([key, value]) => {
      expect(metrics[key as keyof AnimationMetrics]).toBeLessThanOrEqual(value!);
    });
  };
} 