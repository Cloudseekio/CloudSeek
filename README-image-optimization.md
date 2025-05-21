# Image Optimization Implementation

This document outlines the comprehensive image optimization strategy implemented to address the performance issues identified in the Lighthouse audit.

## Core Features Implemented

1. **WebP Image Conversion**
   - Automatic conversion of JPEG/PNG images to WebP format for 25-30% smaller file sizes
   - Fallback to original formats for browsers without WebP support
   - Maintains original images for backward compatibility

2. **Responsive Images**
   - Implementation of `srcset` and `sizes` attributes for delivering appropriately sized images based on viewport
   - Automatic generation of multiple image sizes (640px, 768px, 1024px, 1280px, 1536px)
   - Prevents downloading oversized images on smaller devices

3. **Lazy Loading**
   - Defers loading of below-the-fold images until they're near the viewport
   - Uses native browser `loading="lazy"` attribute
   - Configurable through the `lazy` prop (default: true)

4. **Blur-Up Loading Effect**
   - Generates low-quality image placeholders for a better loading experience
   - Smooth transition from blurred placeholder to full image
   - Improves perceived performance and reduces layout shifts

5. **Image Optimization Build Script**
   - Processes all images during the build process
   - Creates WebP versions and responsive variants
   - Optimizes quality while maintaining visual fidelity
   - Automated as part of the build process

## Components Created

### 1. OptimizedImage Component

The `OptimizedImage` component is a drop-in replacement for the standard `<img>` tag with additional optimizations:

```tsx
<OptimizedImage
  src="/path/to/image.jpg"
  alt="Image description"
  width={800}
  height={600}
  quality={80}
  objectFit="cover"
  lazy={true}
  blurUp={true}
  priority={false}
  className="custom-class"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | required | Source URL of the image |
| `alt` | string | required | Alternative text for the image |
| `width` | number | undefined | Optional width of the image |
| `height` | number | undefined | Optional height of the image |
| `quality` | number | 80 | Image quality (1-100) |
| `objectFit` | 'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down' | 'cover' | How the image should fit in its container |
| `lazy` | boolean | true | Whether to use lazy loading |
| `blurUp` | boolean | true | Whether to use blur-up loading effect |
| `priority` | boolean | false | Mark image as high priority (disables lazy loading) |
| `sizes` | string[] | undefined | Custom sizes attribute for responsive images |
| `className` | string | undefined | Custom CSS class |
| `wrapperClassName` | string | undefined | CSS class for the container element |

### 2. Image Processing Scripts

The image processing is handled by two main components:

1. **`scripts/convertImagesToWebP.js`**
   - Node.js script that processes images in the public directory
   - Converts to WebP format and generates responsive variants
   - Configurable via options at the top of the file

2. **Vite Plugin**
   - `imageOptimizationPlugin` in `vite.config.ts` 
   - Runs the image conversion during the build process
   - Ensures images are always optimized in production builds

## Usage Examples

### Basic Usage

```tsx
import OptimizedImage from './components/OptimizedImage';

// Simple usage
<OptimizedImage src="/images/photo.jpg" alt="A photo" />
```

### Priority (Above-the-fold) Images

```tsx
// For important above-the-fold images
<OptimizedImage 
  src="/images/hero.jpg" 
  alt="Hero image"
  priority={true}
  quality={90}
/>
```

### Responsive Product Images

```tsx
// Product image with specific dimensions and responsive sizes
<OptimizedImage
  src="/images/product.jpg"
  alt="Product name"
  width={600}
  height={600}
  objectFit="contain"
  sizes={['(max-width: 640px) 100vw', '(max-width: 1024px) 50vw', '600px']}
/>
```

### Gallery Images with Lazy Loading

```tsx
// Gallery images that load only when scrolled into view
<div className="grid grid-cols-3 gap-4">
  {images.map(image => (
    <OptimizedImage
      key={image.id}
      src={image.src}
      alt={image.alt}
      lazy={true}
      blurUp={true}
    />
  ))}
</div>
```

## Performance Impact

The implemented optimizations address several key issues identified in the Lighthouse audit:

- ✅ **"Properly size images"** - Fixed via responsive images with srcset
- ✅ **"Efficiently encode images"** - Fixed via WebP conversion and quality optimization
- ✅ **"Serve images in next-gen formats"** - Fixed via WebP format
- ✅ **"Defer offscreen images"** - Fixed via lazy loading
- ✅ **"Image elements do not have explicit width and height"** - Fixed via width/height props

These changes should significantly improve the performance score in Lighthouse, especially for the "Properly size images" and "Serve images in next-gen formats" metrics.

## Further Optimizations

Additional optimizations that could be implemented in the future:

1. **AVIF Support** - Add AVIF format for even better compression
2. **Content-aware cropping** - For responsive art direction
3. **Image CDN Integration** - For dynamic resizing and global distribution
4. **Automatic alt text generation** - Using ML for images without alt text
5. **LQIP (Low Quality Image Placeholders)** - More advanced placeholder generation

## Dependencies Added

The image optimization implementation required adding the following dependencies:

- `sharp`: For image processing and conversion
- `glob`: For finding image files
- `chalk`: For colorized console output

These dependencies are added as development dependencies and are not included in the production bundle. 