import React, { useRef, useEffect, ReactNode, useState } from 'react';

interface SmoothInfiniteCarouselProps {
  children: ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  gap?: number;
  className?: string;
}

export const SmoothInfiniteCarousel: React.FC<SmoothInfiniteCarouselProps> = ({
  children,
  speed = 1,
  pauseOnHover = true,
  gap = 20,
  className = '',
}) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isPausedRef = useRef<boolean>(false);
  const offsetRef = useRef<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const previousTimeRef = useRef<number | null>(null);

  // Enhanced animation with fps-independent motion
  useEffect(() => {
    const outerContainer = outerRef.current;
    const innerContainer = innerRef.current;

    if (!outerContainer || !innerContainer) return;

    // Clone the content to create the illusion of infinite scrolling
    const cloneItems = () => {
      if (innerContainer) {
        // Make sure we start with a clean slate
        const originalItems = Array.from(innerContainer.children).filter(
          child => !child.classList.contains('clone')
        );

        // Remove existing clones
        Array.from(innerContainer.children).forEach(child => {
          if (child.classList.contains('clone')) {
            innerContainer.removeChild(child);
          }
        });

        // Add clones to the end
        originalItems.forEach(item => {
          const clone = item.cloneNode(true) as HTMLElement;
          clone.classList.add('clone');
          innerContainer.appendChild(clone);
        });
      }
    };

    // Initialize by cloning items
    cloneItems();

    // Set the correct gap between items
    const items = innerContainer.children;
    for (let i = 0; i < items.length; i++) {
      (items[i] as HTMLElement).style.marginRight = `${gap}px`;
    }

    // Get the width of the original set (without clones)
    const getOriginalWidth = () => {
      let width = 0;
      const originalItems = Array.from(innerContainer.children).filter(
        child => !child.classList.contains('clone')
      );

      originalItems.forEach(item => {
        const elementWidth = (item as HTMLElement).offsetWidth + gap;
        width += elementWidth;
      });
      
      return width;
    };

    // Animation function using requestAnimationFrame with time-based movement
    const animate = (timestamp: number) => {
      if (!previousTimeRef.current) {
        previousTimeRef.current = timestamp;
      }
      
      // Calculate delta time for smooth animation independent of frame rate
      const deltaTime = timestamp - previousTimeRef.current;
      previousTimeRef.current = timestamp;
      
      if (!isPausedRef.current) {
        // Move the content by incrementing the offset based on time difference
        // This ensures consistent speed regardless of frame rate
        const pixelsPerSecond = speed * 60; // Convert to pixels per second
        const movement = (pixelsPerSecond * deltaTime) / 1000;
        
        offsetRef.current += movement;
        
        // Reset position when we've scrolled the width of the original content
        const originalWidth = getOriginalWidth();
        if (offsetRef.current >= originalWidth) {
          // Smooth reset to avoid visual jump
          offsetRef.current = offsetRef.current % originalWidth;
        }
        
        // Apply the translation with hardware acceleration
        innerContainer.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    setIsInitialized(true);

    // Recalculate on window resize
    const handleResize = () => {
      cloneItems();
      // Reset position on resize to prevent visual jumps
      offsetRef.current = 0;
      if (innerContainer) {
        innerContainer.style.transform = `translate3d(0, 0, 0)`;
      }
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [gap, speed]);

  // Handle pause on hover
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      isPausedRef.current = true;
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      isPausedRef.current = false;
      // Reset timestamp to avoid jumps when resuming
      previousTimeRef.current = null;
    }
  };

  return (
    <div
      ref={outerRef}
      className={`overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={innerRef}
        className="inline-flex" 
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          transform: 'translate3d(0, 0, 0)',
          transition: isInitialized ? 'none' : 'transform 0.2s ease', // Smooth initialization
        }}
      >
        {children}
      </div>
    </div>
  );
}; 