import React, { useState } from 'react';
import { BlogImage } from '../../../models/Blog';
import { useTheme } from '../../../context/ThemeContext';
import OptimizedImage from './OptimizedImage';

interface ImageGalleryProps {
  images: BlogImage[];
  className?: string;
  columns?: 2 | 3 | 4;
  gap?: number;
  aspectRatio?: number;
  lightbox?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className = '',
  columns = 3,
  gap = 4,
  aspectRatio = 1,
  lightbox = true
}) => {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<BlogImage | null>(null);

  const handleImageClick = (image: BlogImage) => {
    if (lightbox) {
      setSelectedImage(image);
    }
  };

  const handleCloseLightbox = () => {
    setSelectedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCloseLightbox();
    } else if (e.key === 'ArrowLeft') {
      navigateImages(-1);
    } else if (e.key === 'ArrowRight') {
      navigateImages(1);
    }
  };

  const navigateImages = (direction: number) => {
    if (!selectedImage) return;
    const currentIndex = images.findIndex(img => img.url === selectedImage.url);
    const newIndex = (currentIndex + direction + images.length) % images.length;
    setSelectedImage(images[newIndex]);
  };

  return (
    <>
      <div
        className={`grid gap-${gap} ${className}`}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
        }}
      >
        {images.map((image, index) => (
          <div
            key={image.url}
            className="relative overflow-hidden rounded-lg cursor-pointer"
            onClick={() => handleImageClick(image)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleImageClick(image);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${image.alt || `image ${index + 1}`}`}
          >
            <OptimizedImage
              image={image}
              aspectRatio={aspectRatio}
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>

      {lightbox && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={handleCloseLightbox}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          tabIndex={-1}
        >
          <div className="relative max-w-7xl mx-auto px-4">
            <button
              className={`absolute top-4 right-4 p-2 rounded-full ${
                theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
              } hover:bg-opacity-80 transition-colors`}
              onClick={handleCloseLightbox}
              aria-label="Close lightbox"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="relative">
              <button
                className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full ${
                  theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
                } hover:bg-opacity-80 transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImages(-1);
                }}
                aria-label="Previous image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="max-h-[90vh] overflow-hidden">
                <OptimizedImage
                  image={selectedImage}
                  className="max-w-full max-h-[90vh] object-contain"
                  priority
                />
              </div>

              <button
                className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full ${
                  theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
                } hover:bg-opacity-80 transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImages(1);
                }}
                aria-label="Next image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {selectedImage.photographer && (
              <div className={`
                text-center mt-4 text-sm
                ${theme === 'dark' ? 'text-gray-300' : 'text-gray-200'}
              `}>
                Photo by{' '}
                <a
                  href={selectedImage.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {selectedImage.photographer}
                </a>
                {selectedImage.source === 'pexels' && ' on Pexels'}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery; 