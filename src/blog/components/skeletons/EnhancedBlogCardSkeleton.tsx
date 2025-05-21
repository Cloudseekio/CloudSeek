import React, { useMemo } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../utils/cn';

// Import this at the component level to ensure the styles are included
import './skeletonAnimations.css';

interface EnhancedBlogCardSkeletonProps {
  variant?: 'default' | 'compact' | 'featured';
  imageHeight?: 'small' | 'medium' | 'large';
  showCategory?: boolean;
  showTags?: boolean;
  showAuthor?: boolean;
  showReadingTime?: boolean;
  className?: string;
  delayMultiplier?: number; // For staggered loading effects
}

/**
 * Enhanced skeleton loader for blog cards with realistic content placeholders,
 * subtle animations, and staggered loading effects.
 */
export const EnhancedBlogCardSkeleton: React.FC<EnhancedBlogCardSkeletonProps> = ({
  variant = 'default',
  imageHeight = 'medium',
  showCategory = true,
  showTags = variant !== 'compact',
  showAuthor = true,
  showReadingTime = true,
  className = '',
  delayMultiplier = 0, // 0 means no delay, 1, 2, 3 etc. for staggered loading
}) => {
  const { theme } = useTheme();
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';
  
  // Generate staggered animation delay
  const animationDelay = delayMultiplier * 150; // 150ms delay between cards
  
  // Calculated height for the image placeholder based on variant and size
  const imageHeightClass = useMemo(() => {
    if (isFeatured) return 'h-64 sm:h-80';
    if (isCompact) return 'h-32 sm:h-40';
    
    switch (imageHeight) {
      case 'small': return 'h-32 sm:h-40';
      case 'large': return 'h-56 sm:h-64';
      case 'medium':
      default: return 'h-40 sm:h-48';
    }
  }, [isCompact, isFeatured, imageHeight]);
  
  // Generate random widths for text lines to make them more realistic
  const titleWidth = useMemo(() => {
    // Between 75% and 100%
    return `${75 + Math.floor(Math.random() * 25)}%`;
  }, []);
  
  const excerptWidths = useMemo(() => {
    // Generate 3 random widths for excerpt lines
    return [
      `${85 + Math.floor(Math.random() * 15)}%`,
      `${75 + Math.floor(Math.random() * 20)}%`,
      `${40 + Math.floor(Math.random() * 35)}%`,
    ];
  }, []);
  
  // Create tailwind styles for animation delays
  const getDelayStyle = (additionalDelay: number = 0) => {
    const totalDelay = animationDelay + additionalDelay;
    if (totalDelay === 0) return {};
    return { animationDelay: `${totalDelay}ms` };
  };
  
  // Background colors based on theme
  const bgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  const hoverBgColor = theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100';
  const cardBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-100';
  
  return (
    <div 
      className={cn(
        'rounded-lg overflow-hidden shadow border transition-all duration-300',
        cardBgColor,
        borderColor,
        hoverBgColor,
        className
      )}
      style={{ 
        transition: 'all 0.3s ease-in-out',
        animationDelay: `${animationDelay}ms`,
        opacity: 1 // Will be animated via CSS
      }}
      role="status"
      aria-label="Loading blog post"
      data-testid="enhanced-blog-card-skeleton"
    >
      {/* Image placeholder with shimmer effect */}
      <div 
        className={cn(
          'relative overflow-hidden w-full',
          imageHeightClass
        )}
        style={getDelayStyle()}
      >
        <div 
          className={cn(
            'absolute inset-0',
            bgColor,
            'animate-pulse'
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skeleton-shimmer" />
      </div>
      
      <div className="p-5">
        {/* Category and tags */}
        {(showCategory || showTags) && (
          <div className="flex flex-wrap gap-2 mb-4" style={getDelayStyle(100)}>
            {showCategory && (
              <div 
                className={cn(
                  'h-6 w-16 rounded-full animate-pulse',
                  bgColor
                )}
              />
            )}
            {showTags && !isCompact && (
              <div 
                className={cn(
                  'h-6 w-20 rounded-full animate-pulse',
                  bgColor
                )}
              />
            )}
          </div>
        )}
        
        {/* Title placeholder */}
        <div 
          className={cn(
            'h-7 rounded mb-3 animate-pulse',
            bgColor
          )}
          style={{ 
            width: titleWidth,
            ...getDelayStyle(150)
          }}
        />
        
        {/* Second title line for featured cards */}
        {isFeatured && (
          <div 
            className={cn(
              'h-7 rounded mb-3 animate-pulse',
              bgColor
            )}
            style={{ 
              width: '60%',
              ...getDelayStyle(200)
            }}
          />
        )}
        
        {/* Excerpt lines - only for non-compact cards */}
        {!isCompact && (
          <div className="space-y-2 mb-4" style={getDelayStyle(250)}>
            <div 
              className={cn(
                'h-4 rounded animate-pulse',
                bgColor
              )}
              style={{ width: excerptWidths[0] }}
            />
            <div 
              className={cn(
                'h-4 rounded animate-pulse',
                bgColor
              )}
              style={{ width: excerptWidths[1] }}
            />
            {!isCompact && (
              <div 
                className={cn(
                  'h-4 rounded animate-pulse',
                  bgColor
                )}
                style={{ width: excerptWidths[2] }}
              />
            )}
          </div>
        )}
        
        {/* Author and metadata */}
        <div 
          className="flex items-center justify-between mt-4"
          style={getDelayStyle(300)}
        >
          {showAuthor && (
            <div className="flex items-center">
              <div 
                className={cn(
                  'h-8 w-8 rounded-full mr-2 animate-pulse',
                  bgColor
                )}
              />
              <div 
                className={cn(
                  'h-4 w-20 rounded animate-pulse',
                  bgColor
                )}
              />
            </div>
          )}
          
          {showReadingTime && (
            <div 
              className={cn(
                'h-4 w-16 rounded animate-pulse',
                bgColor
              )}
            />
          )}
        </div>
      </div>
      
      {/* Screen reader text */}
      <span className="sr-only">Loading blog post content, please wait...</span>
    </div>
  );
};

/**
 * Creates a grid of skeleton cards with staggered loading effects
 */
export const EnhancedBlogCardSkeletonGrid: React.FC<{
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}> = ({
  count = 6,
  columns = 3,
  variant = 'default',
  className = '',
}) => {
  // Generate the grid class based on column count
  const gridClass = useMemo(() => {
    const baseClass = 'grid gap-6';
    switch (columns) {
      case 1: return `${baseClass} grid-cols-1`;
      case 2: return `${baseClass} grid-cols-1 md:grid-cols-2`;
      case 3: return `${baseClass} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
      case 4: return `${baseClass} grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
      default: return `${baseClass} grid-cols-1 md:grid-cols-2 lg:grid-cols-3`;
    }
  }, [columns]);
  
  return (
    <div className={cn(gridClass, className)} data-testid="skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <EnhancedBlogCardSkeleton
          key={index}
          variant={variant}
          delayMultiplier={index}
        />
      ))}
    </div>
  );
};

export default EnhancedBlogCardSkeleton; 