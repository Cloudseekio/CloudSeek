import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { execSync } from 'child_process';
// @ts-expect-error - JavaScript module without type definitions
import { compressionPlugin } from './src/plugins/compressionPlugin';
// @ts-expect-error - JavaScript module without type definitions
import viteCriticalCSSPlugin from './src/utils/criticalCss';

// Check if we're running on Netlify
const isNetlify = process.env.NETLIFY === 'true';

// Image optimization plugin
const imageOptimizationPlugin = () => {
  return {
    name: 'image-optimization',
    buildStart() {
      console.log('🖼️ Running image optimization...');
      try {
        if (isNetlify) {
          console.log('Detected Netlify environment, skipping image conversion');
          console.log('Images will be optimized via Netlify Image CDN');
        } else {
          execSync('node scripts/convertImagesToWebP.js', { stdio: 'inherit' });
        }
      } catch (error) {
        console.error('Image optimization failed:', error);
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imageOptimizationPlugin(),
    compressionPlugin(),
    viteCriticalCSSPlugin({
      // Configure which components are considered above the fold
      contentPaths: [
        // Navigation elements
        './src/components/common/Navbar.tsx',
        
        // Key hero and intro sections
        './src/components/HeroSection.tsx',
        './src/components/home/HeroSection.tsx',
        './src/components/home/IntroSection.tsx',
        './src/components/home/ServicesSection.tsx',
        
        // Loading states that appear during initial render
        './src/components/LoadingFallback.tsx',
        
        // Key interactive elements that appear above the fold
        './src/components/SmoothInfiniteCarousel.jsx',
        './src/components/RotatingTextSlider.tsx',
        
        // Utility components that contribute to above-fold styling
        './src/components/OptimizedImage.tsx',
        
        // Main layout and page components
        './src/App.tsx',
        './src/Home.tsx'
      ],
      // Additional classes to keep in the critical CSS
      whitelistClasses: [
        // Background and text colors
        'bg-[#0f1628]',
        'text-white',
        'text-gray-600',
        'text-blue-600',
        
        // Layout patterns
        'container',
        'fixed',
        'flex',
        'items-center',
        'justify-center',
        'grid',
        'grid-cols-1',
        'lg:grid-cols-2',
        'gap-4',
        'lg:gap-8',
        'w-full',
        'h-full',
        'mx-auto',
        
        // Visual effects
        'backdrop-blur-sm',
        'shadow-sm',
        'rounded-lg',
        'transition',
        'animate-pulse'
      ]
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  publicDir: 'public',
  base: '/',
  server: {
    watch: {
      usePolling: true
    },
    port: 5173
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Add jQuery alias to fix module resolution errors
      'jquery': path.resolve(__dirname, './node_modules/jquery/dist/jquery.js')
    }
  },
  build: {
    // Add cache busting hash to file names for better caching
    assetsInlineLimit: 4096, // 4kb
    cssCodeSplit: true, // Split CSS into chunks
    sourcemap: false, // Disable in production for better performance
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log'], // Remove console.log calls
      },
      output: {
        comments: false, // Remove comments
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor packages into separate chunks
          vendor: [
            'react', 
            'react-dom',
            'react-router-dom'
          ],
          // Group utilities together
          utils: [
            'lodash',
            'axios',
            'dayjs',
            'uuid'
          ],
          // Group UI-related packages
          ui: [
            'framer-motion',
            'react-slick',
            'slick-carousel',
            'styled-components'
          ]
        },
        // Use hashed file names for better caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          // Get the file name or use a default
          const fileName = assetInfo.name || '';
          
          // Put different asset types in different folders with content hashing
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(fileName)) {
            return 'assets/images/[name].[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(fileName)) {
            return 'assets/fonts/[name].[hash][extname]';
          }
          if (/\.css$/i.test(fileName)) {
            return 'assets/css/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        }
      }
    }
  }
});
