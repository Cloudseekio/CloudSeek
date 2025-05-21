import React from 'react';
import { cn } from '../../utils/cn';
import { SkeletonBase, SkeletonAnimationType } from './SkeletonBase';
import { SkeletonText } from './SkeletonText';

interface HeroSectionSkeletonProps {
  /**
   * Animation type or false to disable
   */
  animate?: boolean | SkeletonAnimationType;
  
  /**
   * Additional class name
   */
  className?: string;
  
  /**
   * Whether to show the dashboard cards on the right side
   */
  showDashboards?: boolean;
}

/**
 * Skeleton loader for hero section that matches the dimensions and layout
 * of the actual HeroSection component for a smooth content transition
 */
export const HeroSectionSkeleton: React.FC<HeroSectionSkeletonProps> = ({
  animate = 'shimmer',
  className = '',
  showDashboards = true
}) => {
  return (
    <section className={cn(
      "bg-[#0f1628] text-white py-10 px-8 md:px-12 lg:px-16 xl:px-20 relative overflow-hidden",
      className
    )}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-center">
          {/* Left column - Text content */}
          <div className="space-y-4 pr-0 lg:pr-8">
            {/* Heading skeleton */}
            <SkeletonText
              animate={animate}
              lines={4}
              fontSize="3xl"
              isHeading={true}
              className="mb-4 max-w-xl"
              width={['90%', '70%', '80%', '60%']}
            />
            
            {/* Paragraph skeleton */}
            <SkeletonText
              animate={animate}
              lines={2}
              fontSize="base"
              className="mb-6 max-w-xl"
            />
            
            {/* Button skeleton */}
            <div className="pt-2">
              <SkeletonBase
                animate={animate}
                className="h-12 w-48 md:w-56 rounded-md"
              />
            </div>
          </div>

          {/* Right column - Dashboard visualizations */}
          {showDashboards && (
            <div className="relative h-[400px] lg:h-[380px]">
              {/* Sales Pipeline Widget */}
              <SkeletonBase
                animate={animate}
                className="absolute top-0 right-0 w-full max-w-md rounded-lg p-3 h-24 border border-gray-700 shadow-xl backdrop-blur-sm"
              />
              
              {/* Marketing Cloud Widget */}
              <SkeletonBase
                animate={animate}
                className="absolute top-28 right-4 w-4/5 max-w-sm rounded-lg p-3 h-32 border border-gray-700 shadow-xl backdrop-blur-sm"
              />
              
              {/* Service Cloud Widget */}
              <SkeletonBase
                animate={animate}
                className="absolute bottom-4 right-0 w-full max-w-md rounded-lg p-3 h-28 border border-gray-700 shadow-xl backdrop-blur-sm"
              />
              
              {/* Quota Attainment Circle */}
              <SkeletonBase
                animate={animate}
                className="absolute top-24 right-16 w-16 h-16 rounded-full border-4 border-gray-700"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}; 