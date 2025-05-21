import React, { useState } from 'react';
import { BlogImage } from '../../../models/Blog';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  image: BlogImage;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ image, className = '', alt = '', ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Main image */}
      <img
        src={image.url}
        alt={alt || image.alt || ''}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;