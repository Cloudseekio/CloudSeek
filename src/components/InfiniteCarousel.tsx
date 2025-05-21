import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform, MotionValue } from 'framer-motion';

interface InfiniteCarouselProps {
  children: ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  className?: string;
}

export const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  children,
  speed = 25,
  pauseOnHover = true,
  direction = 'left',
  className = '',
}) => {
  const [duplicatedChildren, setDuplicatedChildren] = useState<ReactNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Create duplicated children for seamless looping
  useEffect(() => {
    // Ensure children is always an array
    const childrenArray = React.Children.toArray(children);
    setDuplicatedChildren([...childrenArray, ...childrenArray]);
  }, [children]);
  
  // Measure container width on mount and on window resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Measure the width of a single set of items
        const singleSetWidth = containerRef.current.scrollWidth / 2;
        setWidth(singleSetWidth);
      }
    };
    
    // Update on mount
    updateWidth();
    
    // Update on resize
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [duplicatedChildren]);
  
  // X position controls
  const baseX = useRef(0);
  const x = useRef(new MotionValue(0));
  
  // Spring physics for smoother motion
  const springConfig = { damping: 40, stiffness: 100, mass: 3 };
  const springX = useSpring(x.current, springConfig);
  
  // Transform the spring value to create the loop
  const loopX = useTransform(springX, (value) => {
    // Reset to the start of the loop when we reached the end
    if (value < -width) {
      baseX.current = baseX.current + width;
      x.current.set(baseX.current);
      return baseX.current;
    }
    return value;
  });
  
  // Animation control based on direction and hover state
  useEffect(() => {
    if (!width) return;
    
    let animationId: number;
    const startTime = performance.now();
    
    // Animation loop function
    const animate = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const directionMultiplier = direction === 'right' ? 1 : -1;
      
      // Calculate movement based on elapsed time and desired speed
      // The speed is pixels per second
      const movement = (speed * elapsed) / 1000 * directionMultiplier;
      
      // Apply the movement if not hovered
      if (!isHovered || !pauseOnHover) {
        baseX.current = directionMultiplier === -1 
          ? -((Math.abs(baseX.current) + movement) % width) 
          : ((baseX.current + movement) % width);
          
        x.current.set(baseX.current);
      }
      
      // Continue the animation
      animationId = requestAnimationFrame(animate);
    };
    
    // Start the animation
    animationId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [width, speed, direction, isHovered, pauseOnHover]);
  
  // Pause animation on hover if enabled
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsHovered(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsHovered(false);
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
    >
      <motion.div
        className="inline-flex"
        style={{ 
          x: loopX,
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        {duplicatedChildren}
      </motion.div>
    </div>
  );
}; 