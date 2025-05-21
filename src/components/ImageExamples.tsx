import React from 'react';
import OptimizedImage from './OptimizedImage';

/**
 * Example component demonstrating all the features of OptimizedImage
 */
const ImageExamples: React.FC = () => {
  // Example image URLs
  const heroImage = '/images/hero-bg.jpg';
  const productImage = '/images/product-example.jpg';
  const galleryImages = [
    '/images/gallery-1.jpg',
    '/images/gallery-2.jpg',
    '/images/gallery-3.jpg',
    '/images/gallery-4.jpg',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Optimized Image Examples</h2>

      <section className="mb-12">
        <h3 className="text-xl font-semibold mb-4">Priority Hero Image (Above the Fold)</h3>
        <p className="mb-4 text-gray-600">
          This image uses <code>priority=true</code> for immediate loading with no lazy loading.
          It also uses WebP format with responsive sizing.
        </p>
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
          <OptimizedImage
            src={heroImage}
            alt="Hero banner"
            priority={true}
            blurUp={true}
            quality={90}
            className="rounded-lg"
          />
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-xl font-semibold mb-4">Product Image with Responsive Sizing</h3>
        <p className="mb-4 text-gray-600">
          This image uses responsive sizing with different widths for different screen sizes.
          It uses lazy loading since it may be below the fold.
        </p>
        <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-md">
          <OptimizedImage
            src={productImage}
            alt="Product example"
            lazy={true}
            blurUp={true}
            objectFit="contain"
            className="rounded-md"
            width={480}
            height={480}
            sizes={['(max-width: 640px) 100vw', '(max-width: 768px) 50vw', '480px']}
          />
          <div className="mt-4">
            <h4 className="text-lg font-medium">Product Name</h4>
            <p className="text-gray-500">Product description goes here</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-xl font-semibold mb-4">Image Gallery with Lazy Loading</h3>
        <p className="mb-4 text-gray-600">
          These images use lazy loading since they're likely below the fold.
          They'll only load when the user scrolls near them.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="bg-gray-100 rounded-lg overflow-hidden">
              <OptimizedImage
                src={image}
                alt={`Gallery image ${index + 1}`}
                lazy={true}
                blurUp={true}
                objectFit="cover"
                className="h-64 w-full rounded-lg"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-xl font-semibold mb-4">Different Object-Fit Examples</h3>
        <p className="mb-4 text-gray-600">
          Demonstrating different objectFit properties on the same image.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {['cover', 'contain', 'fill'].map((fit, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded-lg">
              <div className="h-64 bg-white rounded border border-gray-300 overflow-hidden">
                <OptimizedImage
                  src={productImage}
                  alt={`Object-fit: ${fit}`}
                  objectFit={fit as 'cover' | 'contain' | 'fill'}
                  lazy={true}
                  className="h-full w-full"
                />
              </div>
              <p className="text-center mt-2 font-medium">objectFit: {fit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-xl font-semibold mb-4">Blur-Up Loading Demonstration</h3>
        <p className="mb-4 text-gray-600">
          Demonstrating blur-up loading effect. This image uses a low-quality 
          placeholder that transitions to the full image when loaded.
        </p>
        <div className="max-w-lg mx-auto">
          <OptimizedImage
            src={heroImage}
            alt="Blur-up loading example"
            blurUp={true}
            lazy={true}
            className="rounded-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default ImageExamples; 