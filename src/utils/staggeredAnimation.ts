/**
 * Utility functions for managing staggered animations
 * These functions help create fluid, sequential animations across multiple elements
 */

/**
 * Calculate staggered delay for an element in a sequence
 * 
 * @param index The index of the element in the sequence
 * @param baseDelay The base delay in milliseconds before starting the sequence
 * @param staggerDelay The delay between each element in milliseconds
 * @returns The calculated delay in milliseconds
 * 
 * @example
 * // For a list of items:
 * {items.map((item, index) => (
 *   <div 
 *     key={item.id}
 *     style={{ 
 *       animationDelay: `${calculateStaggerDelay(index, 100, 50)}ms` 
 *     }}
 *   >
 *     {item.content}
 *   </div>
 * ))}
 */
export function calculateStaggerDelay(
  index: number, 
  baseDelay: number = 0, 
  staggerDelay: number = 50
): number {
  return baseDelay + (index * staggerDelay);
}

/**
 * Calculate the total duration of a staggered animation sequence
 * 
 * @param count The number of elements in the sequence
 * @param baseDelay The base delay in milliseconds before starting the sequence
 * @param staggerDelay The delay between each element in milliseconds
 * @param elementDuration The duration of each individual element's animation
 * @returns The total duration of the entire sequence in milliseconds
 */
export function calculateStaggeredSequenceDuration(
  count: number,
  baseDelay: number = 0,
  staggerDelay: number = 50,
  elementDuration: number = 300
): number {
  if (count <= 0) return 0;
  
  // Last element start time + its duration
  return baseDelay + ((count - 1) * staggerDelay) + elementDuration;
}

/**
 * Options for creating a staggered animation batch
 */
export interface StaggeredAnimationOptions {
  /** Number of items in the batch */
  count: number;
  /** Base delay before the first animation starts (ms) */
  baseDelay?: number;
  /** Delay between each item's animation (ms) */
  staggerDelay?: number;
  /** Maximum delay cap (ms) */
  maxDelay?: number;
  /** Whether to reverse the order of animations */
  reverse?: boolean;
  /** Animation grouping size (items that animate together) */
  groupSize?: number;
}

/**
 * Create an array of delays for a staggered animation batch
 * 
 * Useful for pre-calculating all delays for a sequence of animations
 * and handling complex staggering patterns like grouping or reversing.
 * 
 * @param options Configuration options for the staggered batch
 * @returns Array of delay values in milliseconds
 * 
 * @example
 * const delays = createStaggeredBatch({ count: 10, staggerDelay: 50, groupSize: 2 });
 * // Returns: [0, 0, 50, 50, 100, 100, 150, 150, 200, 200]
 * 
 * // In a component:
 * const listDelays = createStaggeredBatch({ 
 *   count: items.length, 
 *   staggerDelay: 75,
 *   reverse: sortOrder === 'desc' 
 * });
 * 
 * // Then in rendering:
 * {items.map((item, index) => (
 *   <animated.div key={item.id} style={{ 
 *     ...otherStyles,
 *     transitionDelay: `${listDelays[index]}ms`
 *   }}>
 *     {item.content}
 *   </animated.div>
 * ))}
 */
export function createStaggeredBatch({
  count,
  baseDelay = 0,
  staggerDelay = 50,
  maxDelay = Infinity,
  reverse = false,
  groupSize = 1
}: StaggeredAnimationOptions): number[] {
  if (count <= 0) return [];
  if (groupSize <= 0) groupSize = 1;
  
  const delays: number[] = [];
  
  for (let i = 0; i < count; i++) {
    // Calculate which group this item belongs to
    const groupIndex = Math.floor(i / groupSize);
    
    // Calculate delay based on group
    let delay = baseDelay + (groupIndex * staggerDelay);
    
    // Cap the delay if maxDelay is specified
    if (delay > maxDelay) {
      delay = maxDelay;
    }
    
    delays.push(delay);
  }
  
  // Reverse the order if needed
  if (reverse) {
    // We can't just reverse the array because that would reorder elements
    // Instead, we need to calculate "reversed" delays while keeping elements in order
    const maxCalculatedDelay = delays[delays.length - 1];
    
    for (let i = 0; i < count; i++) {
      const originalDelay = delays[i];
      delays[i] = maxCalculatedDelay - originalDelay + baseDelay;
    }
  }
  
  return delays;
}

/**
 * Get easing function parameters for different animation types
 * 
 * @param type The type of easing function
 * @returns CSS cubic-bezier parameters
 */
export function getEasing(type: 'enter' | 'exit' | 'emphasis' | 'standard' | 'decelerate' | 'accelerate'): string {
  switch (type) {
    case 'enter':
      return 'cubic-bezier(0.0, 0.0, 0.2, 1)'; // Deceleration
    case 'exit':
      return 'cubic-bezier(0.4, 0.0, 1, 1)'; // Acceleration
    case 'emphasis':
      return 'cubic-bezier(0.4, 0.0, 0.2, 1)'; // Standard with emphasis
    case 'standard':
      return 'cubic-bezier(0.4, 0.0, 0.2, 1)'; // Standard
    case 'decelerate':
      return 'cubic-bezier(0.0, 0.0, 0.2, 1)'; // Deceleration
    case 'accelerate':
      return 'cubic-bezier(0.4, 0.0, 1, 1)'; // Acceleration
    default:
      return 'ease';
  }
}

export default {
  calculateStaggerDelay,
  calculateStaggeredSequenceDuration,
  createStaggeredBatch,
  getEasing
}; 