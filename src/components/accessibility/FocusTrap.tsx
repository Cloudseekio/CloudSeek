import React, { useEffect, useRef } from 'react';

interface FocusTrapProps {
  /**
   * The content to be rendered inside the focus trap
   */
  children: React.ReactNode;
  
  /**
   * Whether the focus trap is active
   */
  active?: boolean;
  
  /**
   * Whether to auto focus the first focusable element when activated
   */
  autoFocus?: boolean;
  
  /**
   * Element to be focused initially when trap is activated
   * If not provided, the first focusable element will be used
   */
  initialFocus?: React.RefObject<HTMLElement>;
  
  /**
   * Element to be focused when trap is deactivated
   */
  returnFocus?: React.RefObject<HTMLElement>;
  
  /**
   * Called when attempt to focus outside the trap is made
   */
  onEscape?: () => void;
  
  /**
   * CSS class name
   */
  className?: string;
}

/**
 * FocusTrap component that keeps focus inside a container
 * Useful for modals, dialogs, and other popups
 */
export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true,
  autoFocus = true,
  initialFocus,
  returnFocus,
  onEscape,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Save the currently focused element so we can restore it later
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Initial focus handling
    const focusFirstElement = () => {
      if (initialFocus && initialFocus.current) {
        initialFocus.current.focus();
        return;
      }

      if (!containerRef.current || !autoFocus) return;

      // Get all focusable elements within the container
      const focusableElements = getFocusableElements(containerRef.current);
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    };

    // Set initial focus
    focusFirstElement();

    return () => {
      // Restore focus when the component unmounts or becomes inactive
      if (returnFocus && returnFocus.current) {
        returnFocus.current.focus();
      } else if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, autoFocus, initialFocus, returnFocus]);

  // Handle tab key press to keep focus inside the container
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (event.key !== 'Tab') return;

      // Handle tabbing
      const focusableElements = getFocusableElements(containerRef.current!);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      const isShiftTab = event.shiftKey;

      // If tabbing forward and the last element is active, wrap to the first
      if (!isShiftTab && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
      
      // If tabbing backward and the first element is active, wrap to the last
      if (isShiftTab && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, onEscape]);

  // If not active, just render children
  if (!active) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className={className} data-focus-trap>
      {children}
    </div>
  );
};

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableElementsSelector = [
    'a[href]:not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]:not([tabindex="-1"])'
  ].join(',');

  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableElementsSelector)
  );
}

export default FocusTrap; 