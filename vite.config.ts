import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Check if we're running on Netlify
const isNetlify = process.env.NETLIFY === 'true';

// Simplified build without external script dependencies
const simpleBuildPlugin = () => {
  return {
    name: 'simple-build',
    buildStart() {
      console.log('🚀 Starting build...');
      if (isNetlify) {
        console.log('Detected Netlify environment');
        console.log('Images will be optimized via Netlify Image CDN');
      } else {
        console.log('Local build mode');
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    simpleBuildPlugin()
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'lodash',
      'dayjs',
      'uuid',
      'framer-motion',
      'styled-components'
    ],
    esbuildOptions: {
      // Ensure all dependencies are bundled as ES modules
      format: 'esm',
      target: 'es2020'
    }
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
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    // Add cache busting hash to file names for better caching
    assetsInlineLimit: 4096, // 4kb
    cssCodeSplit: true, // Split CSS into chunks
    sourcemap: false, // Disable in production for better performance
    minify: 'esbuild', // Use esbuild for faster and more reliable minification
    target: 'es2020', // Modern ES target
    rollupOptions: {
      // Ensure external dependencies don't use CommonJS
      external: [],
      output: {
        format: 'es', // Force ES module format
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
