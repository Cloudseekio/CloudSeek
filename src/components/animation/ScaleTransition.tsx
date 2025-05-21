import React, { forwardRef, ReactNode } from 'react';
import { TransitionComponent, TransitionProps } from './TransitionComponent';
import { cn } from '../../utils/cn';

export interface ScaleTransitionProps extends Omit<TransitionProps, 'transitionClassName' | 'children'> {
  /** Content to render */
  children: ReactNode;
  /** Scale factor when fully visible (1 by default) */
  visibleScale?: number;
  /** Scale factor when fully hidden (0.9 by default) */
  hiddenScale?: number;
  /** Whether to combine with fade effect */
  fade?: boolean;
  /** Origin point for scaling (CSS transform-origin value) */
  origin?: string;
  /** Additional CSS classes for scale effect */
  scaleClassName?: string;
}

/**
 * ScaleTransition - Component for smooth scale/zoom animations
 * 
 * This component uses the core TransitionComponent to implement
 * elegant scale transitions with configurable scale factors and origin.
 * 
 * @example
 * <ScaleTransition in={isVisible} visibleScale={1} hiddenScale={0.8} origin="top center">
 *   <div>Content that scales</div>
 * </ScaleTransition>
 */
export const ScaleTransition = forwardRef<HTMLDivElement, ScaleTransitionProps>(
  (
    {
      children,
      visibleScale = 1,
      hiddenScale = 0.9,
      fade = true,
      origin = 'center center',
      scaleClassName = '',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    return (
      <TransitionComponent
        ref={ref}
        className={cn('scale-transition', scaleClassName, className)}
        style={style}
        {...rest}
      >
        {(status) => {
          // Calculate scale based on status
          const scale = 
            status === 'entered' ? visibleScale :
            status === 'exited' ? hiddenScale :
            status === 'entering' ? undefined : // Let CSS handle the transition
            status === 'exiting' ? undefined : // Let CSS handle the transition
            undefined;
          
          const styles: React.CSSProperties = {
            transform: scale !== undefined ? `scale(${scale})` : undefined,
            opacity: fade ? 
              (status === 'entered' ? 1 : 
               status === 'exited' ? 0 : 
               undefined) : 
              undefined,
            transformOrigin: origin,
            // Use hardware acceleration for smoother animations
            willChange: status === 'entering' || status === 'exiting' ? 
              (fade ? 'transform, opacity' : 'transform') : 
              'auto'
          };

          return (
            <div
              style={styles}
              className={cn(
                'scale-transition-inner',
                fade && 'scale-transition-with-fade',
                status === 'entering' && 'scale-transition-entering',
                status === 'entered' && 'scale-transition-entered',
                status === 'exiting' && 'scale-transition-exiting',
                status === 'exited' && 'scale-transition-exited'
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

ScaleTransition.displayName = 'ScaleTransition';

export default ScaleTransition; 