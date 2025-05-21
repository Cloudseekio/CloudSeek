import React from 'react';
import { CombinedAsset } from '../../types/contentful';
import { ImageType } from '../../services/imageService';
import { getImageService } from '../../services/serviceFactory';
import OptimizedImage from '../images/OptimizedImage';
import { useTheme } from '../../../context/ThemeContext';

interface AssetRendererProps {
  asset: CombinedAsset;
  type?: ImageType;
  className?: string;
  priority?: boolean;
  aspectRatio?: number;
  sizes?: string;
}

const AssetRenderer: React.FC<AssetRendererProps> = ({
  asset,
  type = 'inline',
  className = '',
  priority = false,
  aspectRatio,
  sizes
}) => {
  const { theme } = useTheme();
  const [image, setImage] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    
    const loadImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use the factory method to get the service instance
        const imageService = getImageService();
        const processedImage = await imageService.getImage(asset, type);
        
        if (isMounted) {
          setImage(processedImage);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading image:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load image');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImage();
    
    return () => {
      isMounted = false;
    };
  }, [asset, type]);

  // Improved loading state UI
  if (isLoading) {
    return (
      <div className={`
        flex items-center justify-center p-4 rounded-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
        ${className}
      `}>
        <div className="animate-pulse flex space-x-4 w-full">
          <div className="flex-1 space-y-4 py-1">
            <div className={`h-40 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded`}></div>
          </div>
        </div>
      </div>
    );
  }

  // Better error state UI
  if (error) {
    return (
      <div className={`
        flex flex-col items-center justify-center p-4 rounded-lg
        ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}
        ${className}
      `}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-red-500 mb-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{error}</span>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!image) {
    return (
      <div className={`
        flex items-center justify-center p-4 rounded-lg
        ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}
        ${className}
      `}>
        <span>No image available</span>
      </div>
    );
  }

  return (
    <OptimizedImage
      image={image}
      className={className}
      priority={priority}
      aspectRatio={aspectRatio}
      sizes={sizes}
      blur
    />
  );
};

export default AssetRenderer; 