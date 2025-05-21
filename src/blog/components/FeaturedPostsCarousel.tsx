import React, { useState, useEffect, useRef } from 'react';
import { BlogPost } from '../../models/Blog';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatDate } from '../../utils/dateUtils';

interface FeaturedPostsCarouselProps {
  posts: BlogPost[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
  className?: string;
  variant?: 'default' | 'overlay' | 'minimal';
  maxPosts?: number;
}

const FeaturedPostsCarousel: React.FC<FeaturedPostsCarouselProps> = ({
  posts,
  autoPlay = true,
  interval = 5000,
  showIndicators = true,
  showArrows = true,
  className = '',
  variant = 'default',
  maxPosts = 5
}) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Swipe handlers for touch devices
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Filter for only featured posts and limit to maxPosts
  const featuredPosts = posts
    .filter(post => post.featured)
    .slice(0, maxPosts);

  // Use all posts if no featured posts exist (limited to maxPosts)
  const displayPosts = featuredPosts.length > 0 
    ? featuredPosts 
    : posts.slice(0, maxPosts);

  // Start autoplay
  useEffect(() => {
    if (autoPlay && !isPaused && displayPosts.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === displayPosts.length - 1 ? 0 : prevIndex + 1
        );
      }, interval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, isPaused, interval, displayPosts.length]);

  // Early return if no posts exist
  if (displayPosts.length === 0) {
    return null;
  }

  // Extract current post
  const post = displayPosts[currentIndex];

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === displayPosts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? displayPosts.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    const difference = touchStartX.current - touchEndX.current;
    
    if (difference > 50) {
      goToNext();
    } else if (difference < -50) {
      goToPrev();
    }
    
    // Resume autoplay after swipe
    setTimeout(() => setIsPaused(false), 1000);
  };

  // Render variant-specific layout
  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={sliderRef}
    >
      {variant === 'overlay' && (
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
          {post.coverImage && (
            <img 
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 flex flex-col justify-end p-6">
            <div className="text-white">
              <div className="flex items-center text-sm mb-2">
                <Clock size={14} className="mr-1" />
                <span>{formatDate(post.publishDate)}</span>
                {post.category && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{post.category}</span>
                  </>
                )}
              </div>
              <Link to={`/blog/${post.slug}`} className="hover:underline">
                <h2 className="text-xl md:text-2xl font-bold mb-2">{post.title}</h2>
              </Link>
              <p className="text-sm md:text-base opacity-90 line-clamp-2">{post.excerpt}</p>
            </div>
          </div>
        </div>
      )}

      {variant === 'minimal' && (
        <div className="relative w-full">
          <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <Link to={`/blog/${post.slug}`} className="hover:underline">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            </Link>
            <div className="flex items-center text-sm mb-3">
              <Clock size={14} className="mr-1" />
              <span>{formatDate(post.publishDate)}</span>
              {post.category && (
                <>
                  <span className="mx-2">•</span>
                  <span>{post.category}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {variant === 'default' && (
        <div className="relative w-full">
          {post.coverImage && (
            <div className="aspect-[16/9]">
              <img 
                src={post.coverImage.url}
                alt={post.coverImage.alt}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center text-sm mb-2">
              <Clock size={14} className="mr-1" />
              <span>{formatDate(post.publishDate)}</span>
              {post.category && (
                <>
                  <span className="mx-2">•</span>
                  <span>{post.category}</span>
                </>
              )}
            </div>
            <Link to={`/blog/${post.slug}`} className="hover:underline">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
            </Link>
            <p className="text-sm opacity-90 line-clamp-3">{post.excerpt}</p>
          </div>
        </div>
      )}

      {/* Navigation arrows */}
      {showArrows && displayPosts.length > 1 && (
        <>
          <button 
            onClick={goToPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 dark:bg-black/30 flex items-center justify-center transition hover:bg-white dark:hover:bg-black/50"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 dark:bg-black/30 flex items-center justify-center transition hover:bg-white dark:hover:bg-black/50"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Slide indicators */}
      {showIndicators && displayPosts.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {displayPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-4' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedPostsCarousel; 