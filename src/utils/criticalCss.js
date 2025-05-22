/**
 * Critical CSS Extraction and Inlining for Vite
 * 
 * This utility helps extract critical CSS from a Vite application
 * and inline it in the HTML for faster page loading.
 */

import fs from 'fs';
import path from 'path';
import PurgeCSS from 'purgecss';
import glob from 'glob';

/**
 * Extracts critical CSS for above-the-fold content
 * @param {Object} options Configuration options
 * @returns {string} Critical CSS as a string
 */
export async function extractCriticalCSS(options = {}) {
  const {
    contentPaths = ['./src/**/*.tsx', './src/**/*.jsx'],
    cssPath = './dist/assets/index-*.css',
    whitelistClasses = []
  } = options;
  
  try {
    // Find the generated CSS file in dist
    const cssFiles = glob.sync(cssPath);
    if (!cssFiles.length) {
      console.error('No CSS files found in dist/assets folder. Make sure to run the build first.');
      return '';
    }
    
    const cssFilePath = cssFiles[0];
    const css = fs.readFileSync(cssFilePath, 'utf8');
    
    // Extract critical CSS using PurgeCSS
    const result = await new PurgeCSS().purge({
      content: contentPaths,
      css: [{ raw: css }],
      safelist: {
        standard: whitelistClasses,
        deep: [/^bg-/, /^text-/, /^h-/, /^w-/, /^mt-/, /^mb-/, /^mx-/, /^my-/, /^p-/, /^m-/],
        greedy: [/^backdrop-blur/, /^shadow-/, /^grid-/, /^flex-/]
      },
      // Focus on components likely to be above the fold
      // Adjust these as needed based on your application
      extractors: [
        {
          extractor: (content) => {
            // Custom extractor to prioritize hero/header components
            const matches = content.match(/hero|header|navbar|nav|intro|above-fold/g) || [];
            return matches;
          },
          extensions: ['html', 'tsx', 'jsx']
        }
      ],
    });
    
    if (result.length > 0) {
      return result[0].css;
    }
    
    return '';
  } catch (error) {
    console.error('Error extracting critical CSS:', error);
    return '';
  }
}

/**
 * Vite plugin to inline critical CSS during the build
 * @param {Object} options Plugin options
 * @returns {Object} Vite plugin
 */
export default function viteCriticalCSSPlugin(options = {}) {
  return {
    name: 'vite-plugin-critical-css',
    apply: 'build',
    order: 'post',
    transformIndexHtml: {
      order: 'post',
      handler: async (html) => {
        try {
          // Only run after the build is complete and we have CSS files
          if (!fs.existsSync('./dist/assets')) {
            return html;
          }
          
          const criticalCSS = await extractCriticalCSS(options);
          
          if (!criticalCSS) {
            console.warn('No critical CSS was extracted.');
            return html;
          }
          
          // Simply inject the critical CSS as a style tag
          const inlinedHtml = html.replace(
            '</head>',
            `<style id="critical-css">${criticalCSS}</style></head>`
          );
          
          // Add preload for the main CSS file
          const cssFiles = glob.sync('./dist/assets/index-*.css');
          if (cssFiles.length) {
            const cssFileName = path.basename(cssFiles[0]);
            
            // Add preload link for async CSS loading
            return inlinedHtml.replace(
              '</head>',
              `<link rel="preload" href="/assets/${cssFileName}" as="style" onload="this.onload=null;this.rel='stylesheet'">
              <noscript><link rel="stylesheet" href="/assets/${cssFileName}"></noscript>
              </head>`
            );
          }
          
          return inlinedHtml;
        } catch (error) {
          console.error('Error applying critical CSS:', error);
          return html;
        }
      }
    }
  };
} 