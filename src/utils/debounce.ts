export function debounce<T extends unknown[], R>(
  func: (...args: T) => R,
  wait: number
): (...args: T) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: T) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
} 