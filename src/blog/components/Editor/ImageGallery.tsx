import React, { useState, useCallback, useEffect } from 'react';
import { BlogImage } from '../../../models/Blog';
import { getImageService } from '../../services/serviceFactory';
import { useTheme } from '../../../context/ThemeContext';
import { X, Upload, Search, ExternalLink } from 'lucide-react';
import OptimizedImage from '../images/OptimizedImage';

interface ImageGalleryProps {
  onSelect: (image: BlogImage) => void;
  onClose: () => void;
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  onSelect,
  onClose,
  className = ''
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [images, setImages] = useState<BlogImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Use the factory method to get the service
      const imageService = getImageService();
      const loadedImages = await imageService.getImages();
      setImages(loadedImages);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load images';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Use the factory method to get the service
      const imageService = getImageService();
      const image = await imageService.uploadImage(file, {
        onProgress: (progress) => setUploadProgress(progress)
      });
      setImages((prev) => [image, ...prev]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleUpload(file);
    }
  }, [handleUpload]);

  const filteredImages = images.filter(image => 
    image.alt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 ${className}`}
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-4xl max-h-[90vh] rounded-lg shadow-xl ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Image Gallery
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-opacity-10 transition-colors ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            aria-label="Close gallery"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search and Upload */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search 
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} 
                size={18} 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <label className={`flex items-center px-4 py-2 rounded-lg cursor-pointer ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-500'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}>
              <Upload size={18} className="mr-2" />
              Upload
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
            </label>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  Uploading...
                </span>
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Error</p>
                  <p>{error}</p>
                  <button 
                    onClick={loadImages} 
                    className="mt-2 text-sm underline text-red-700 hover:text-red-800"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Grid with Loading State */}
        <div 
          className="p-4 overflow-y-auto max-h-[60vh]"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                Loading images...
              </p>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.url}
                  className={`group relative rounded-lg overflow-hidden border ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}
                >
                  <OptimizedImage
                    image={image}
                    className="w-full aspect-square object-cover"
                  />
                  <div className={`absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDark ? 'bg-gray-900/80' : 'bg-white/80'
                  }`}>
                    <button
                      onClick={() => onSelect(image)}
                      className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                      aria-label="Insert image"
                    >
                      <Upload size={18} />
                    </button>
                    <a
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600"
                      aria-label="View original"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {searchQuery ? 'No images match your search' : 'No images available'}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-blue-500 hover:text-blue-600"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery; 