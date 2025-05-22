/**
 * Critical CSS Extraction and Inlining for Vite
 * 
 * This utility helps extract critical CSS from a Vite application
 * and inline it in the HTML for faster page loading.
 */

import fs from 'fs';
import path from 'path';

/**
 * Simplified critical CSS extraction without external dependencies
 * @param {Object} options Configuration options
 * @returns {string} Basic critical CSS as a string
 */
export async function extractCriticalCSS(options = {}) {
  // Return a basic critical CSS for essential styles
  return `
    body { margin: 0; padding: 0; font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    html, body { height: 100%; }
    #root { height: 100%; }
    .bg-\\[\\#0f1628\\] { background-color: #0f1628; }
    .text-white { color: white; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
    .transition { transition: all 0.3s ease; }
  `;
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
          
          return inlinedHtml;
        } catch (error) {
          console.error('Error applying critical CSS:', error);
          return html;
        }
      }
    }
  };
} 