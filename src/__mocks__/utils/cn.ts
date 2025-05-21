/**
 * A simple mock implementation of the cn (className) utility
 * Combines and filters class names
 */
export function cn(...classes: (string | undefined | null | false | 0)[]) {
  return classes.filter(Boolean).join(' ');
}

export default cn; 