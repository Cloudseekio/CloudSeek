import React, { useMemo, useRef } from 'react';
import isEqual from 'lodash/isEqual';

/**
 * Custom hook that provides deep comparison for useMemo
 * 
 * @example
 * const expensiveValue = useMemoDeep(() => computeExpensiveValue(a, b), [a, b]);
 * 
 * @param factory Function that computes the value
 * @param deps Dependency array that triggers recomputation when changed
 * @returns Memoized value that only changes when dependencies change based on deep equality
 */
export function useMemoDeep<T>(factory: () => T, deps: React.DependencyList): T {
  // Keep track of the last deps value with a ref
  const depsRef = useRef<React.DependencyList>(deps);
  
  // Only recompute if deps have changed based on deep comparison
  const depsHaveChanged = !isEqual(deps, depsRef.current);
  
  // Update the ref if deps have changed
  if (depsHaveChanged) {
    depsRef.current = deps;
  }
  
  // Use standard useMemo but only depend on whether the deep comparison detected a change
  return useMemo(factory, [depsHaveChanged]);
}

/**
 * Custom hook for memoizing callbacks with deep comparison of dependencies
 * Similar to useCallback but with deep equality check
 * 
 * @example
 * const handleSubmit = useCallbackDeep((data) => {
 *   submitForm({ ...data, user: currentUser });
 * }, [currentUser]);
 * 
 * @param callback Function to memoize
 * @param deps Dependency array that triggers callback recreation when changed
 * @returns Memoized callback that only changes when dependencies change based on deep equality
 */
export function useCallbackDeep<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T {
  // Use our useMemoDeep to create a memoized version of the callback
  return useMemoDeep(() => callback, deps);
}

/**
 * Utility to optimize renders in lists by providing a stable identity function
 * 
 * @example
 * const getItemKey = useStableItemKey(item => item.id);
 * 
 * return (
 *   <ul>
 *     {items.map(item => (
 *       <li key={getItemKey(item)}>
 *         {item.name}
 *       </li>
 *     ))}
 *   </ul>
 * );
 * 
 * @param keyFn Function that extracts a key from an item
 * @returns A stable function that maintains identity across renders
 */
export function useStableItemKey<T, K extends string | number>(
  keyFn: (item: T) => K
): (item: T) => K {
  // This function should never change its reference
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => keyFn, []);
}

export default {
  useMemoDeep,
  useCallbackDeep,
  useStableItemKey
}; 