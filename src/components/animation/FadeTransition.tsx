import React, { forwardRef, ReactNode } from 'react';
import { TransitionComponent, TransitionProps } from './TransitionComponent';
import { cn } from '../../utils/cn';

export interface FadeTransitionProps extends Omit<TransitionProps, 'transitionClassName' | 'children'> {
  /** Content to render */
  children: ReactNode;
  /** Optional opacity when fully visible (1 by default) */
  visibleOpacity?: number;
  /** Optional opacity when fully hidden (0 by default) */
  hiddenOpacity?: number;
  /** Whether to use CSS transform for better performance */
  useTransform?: boolean;
  /** Additional CSS classes for fade effect */
  fadeClassName?: string;
}

/**
 * FadeTransition - Component for smooth fade in/out animations
 * 
 * This component uses the core TransitionComponent to implement
 * elegant fade transitions with configurable opacity levels.
 * 
 * @example
 * <FadeTransition in={isVisible} enterDuration={300} exitDuration={200}>
 *   <div>Content that fades in and out</div>
 * </FadeTransition>
 */
export const FadeTransition = forwardRef<HTMLDivElement, FadeTransitionProps>(
  (
    {
      children,
      visibleOpacity = 1,
      hiddenOpacity = 0,
      useTransform = true,
      fadeClassName = '',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <TransitionComponent
        ref={ref}
        className={cn('fade-transition', fadeClassName, className)}
        style={style}
        {...rest}
      >
        {(status) => {
          const styles: React.CSSProperties = {
            opacity:
              status === 'entered'
                ? visibleOpacity
                : status === 'exited'
                ? hiddenOpacity
                : undefined,
            ...(useTransform && {
              transform:
                status === 'entering' || status === 'entered'
                  ? 'translateZ(0)'
                  : 'translateZ(0)',
            }),
          };

          return (
            <div
              style={styles}
              className={cn(
                'fade-transition-inner',
                status === 'entering' && 'fade-transition-entering',
                status === 'entered' && 'fade-transition-entered',
                status === 'exiting' && 'fade-transition-exiting',
                status === 'exited' && 'fade-transition-exited'
              )}
            >
              {children}
            </div>
          );
        }}
      </TransitionComponent>
    );
  }
);

FadeTransition.displayName = 'FadeTransition';

export default FadeTransition; 