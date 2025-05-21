import React, { forwardRef, ReactNode } from 'react';
import { TransitionComponent, TransitionProps } from './TransitionComponent';
import { cn } from '../../utils/cn';

export type SlideDirection = 'up' | 'down' | 'left' | 'right';

export interface SlideTransitionProps extends Omit<TransitionProps, 'transitionClassName' | 'children'> {
  /** Content to render */
  children: ReactNode;
  /** Direction of the slide animation */
  direction?: SlideDirection;
  /** Distance to slide in pixels (or valid CSS value like '100%') */
  distance?: string | number;
  /** Additional CSS classes for slide effect */
  slideClassName?: string;
}

/**
 * SlideTransition - Component for smooth slide animations
 * 
 * This component uses the core TransitionComponent to implement
 * elegant slide transitions with configurable direction and distance.
 * 
 * @example
 * <SlideTransition in={isVisible} direction="up" distance={20}>
 *   <div>Content that slides up/down</div>
 * </SlideTransition>
 */
export const SlideTransition = forwardRef<HTMLDivElement, SlideTransitionProps>(
  (
    {
      children,
      direction = 'up',
      distance = 20,
      slideClassName = '',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Convert number to pixels if necessary
    const distanceValue = typeof distance === 'number' ? `${distance}px` : distance;

    return (
      <TransitionComponent
        ref={ref}
        className={cn('slide-transition', `slide-direction-${direction}`, slideClassName, className)}
        style={style}
        {...rest}
      >
        {(status) => {
          // Calculate transform based on direction and status
          let transform = 'translate3d(0, 0, 0)';
          
          if (status === 'entering' || status === 'exiting' || status === 'exited') {
            switch (direction) {
              case 'up':
                transform = status === 'exited' || status === 'exiting'
                  ? `translate3d(0, ${distanceValue}, 0)`
                  : 'translate3d(0, 0, 0)';
                break;
              case 'down':
                transform = status === 'exited' || status === 'exiting'
                  ? `translate3d(0, -${distanceValue}, 0)`
                  : 'translate3d(0, 0, 0)';
                break;
              case 'left':
                transform = status === 'exited' || status === 'exiting'
                  ? `translate3d(${distanceValue}, 0, 0)`
                  : 'translate3d(0, 0, 0)';
                break;
              case 'right':
                transform = status === 'exited' || status === 'exiting'
                  ? `translate3d(-${distanceValue}, 0, 0)`
                  : 'translate3d(0, 0, 0)';
                break;
            }
          }
          
          const styles: React.CSSProperties = {
            transform,
            // Use hardware acceleration for smoother animations
            willChange: status === 'entering' || status === 'exiting' ? 'transform' : 'auto'
          };

          return (
            <div
              style={styles}
              className={cn(
                'slide-transition-inner',
                status === 'entering' && 'slide-transition-entering',
                status === 'entered' && 'slide-transition-entered',
                status === 'exiting' && 'slide-transition-exiting',
                status === 'exited' && 'slide-transition-exited'
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

SlideTransition.displayName = 'SlideTransition';

export default SlideTransition; 