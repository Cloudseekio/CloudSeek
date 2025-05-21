import { useRef, useState, useEffect } from 'react';
import { useAnimationControls } from 'framer-motion';

interface UseInfiniteCarouselProps {
  speed?: number;
  pauseOnHover?: boolean;
}

export function useInfiniteCarousel({
  speed = 25,
  pauseOnHover = true,
}: UseInfiniteCarouselProps = {}) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [containerWidth, setContainerWidth] = useState(0);
  const [innerWidth, setInnerWidth] = useState(0);
  const [isDuplicated, setIsDuplicated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Calculate the widths of elements on mount and window resize
  useEffect(() => {
    const calculateWidths = () => {
      if (containerRef.current && innerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setInnerWidth(innerRef.current.offsetWidth / 2); // Divide by 2 because we duplicate the content
      }
    };

    calculateWidths();
    setIsInitialized(true);

    window.addEventListener('resize', calculateWidths);
    return () => window.removeEventListener('resize', calculateWidths);
  }, []);

  // Main animation effect that handles the animation with Framer Motion
  useEffect(() => {
    // Only start animation once we have measurements
    if (!isInitialized || !innerWidth || !containerWidth) return;

    // The duration should be proportional to the content width for consistent speed feel
    const duration = innerWidth / speed;

    const startAnimation = () => {
      controls.start({
        x: -innerWidth,
        transition: {
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      });
    };

    if (pauseOnHover && isHovered) {
      controls.stop();
    } else {
      startAnimation();
    }

    return () => {
      controls.stop();
    };
  }, [controls, innerWidth, containerWidth, speed, isHovered, pauseOnHover, isInitialized]);

  // Mark content as duplicated after first render
  useEffect(() => {
    setIsDuplicated(true);
  }, []);

  // Event handlers for mouse interactions
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

  return {
    containerRef,
    innerRef,
    controls,
    isDuplicated,
    handleMouseEnter,
    handleMouseLeave,
    containerProps: {
      ref: containerRef,
      className: "overflow-hidden relative"
    },
    innerProps: {
      ref: innerRef,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave
    }
  };
} 