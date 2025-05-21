# Critical CSS Optimization

This document explains the critical CSS optimization implemented in our Vite React application to improve the First Contentful Paint (FCP) metric and overall page load performance.

## Overview

Critical CSS is a technique that extracts and inlines the CSS needed for above-the-fold content directly in the HTML file. This eliminates render-blocking CSS requests and allows the visible portion of your page to render much faster.

Our implementation:
1. Extracts the essential CSS for above-the-fold components
2. Inlines this CSS in the `<head>` of the HTML document
3. Loads the remaining CSS asynchronously to avoid blocking rendering

## Implementation Details

### Components

1. **Vite Plugin**: `src/utils/criticalCss.js`
   - Custom Vite plugin that handles critical CSS extraction during build time
   - Integrates with the Vite build pipeline

2. **Post-build Script**: `scripts/extractCriticalCss.js`
   - Standalone script that can be run after the build process
   - Extracts critical CSS and modifies the `index.html` file

3. **Package.json Integration**:
   - Added as a `postbuild` script to automatically run after the main build
   - Also available as a standalone script: `npm run extract-critical-css`

### How It Works

1. **Identification Phase**: The system identifies critical components that appear above the fold
   - HeroSection
   - IntroSection
   - ServicesSection
   - Navigation components

2. **Extraction Phase**: Using PurgeCSS, we analyze these components and extract only the CSS rules they need

3. **Inlining Phase**: The extracted CSS is placed directly in the `<head>` of the HTML document

4. **Async Loading**: The full CSS file is then loaded asynchronously, using `rel="preload"` and the `onload` attribute

## Configuration

The critical CSS extraction is configured in two places:

1. **Vite Config** (`vite.config.ts`):
   ```javascript
   viteCriticalCSSPlugin({
     contentPaths: [
       './src/components/HeroSection.tsx',
       './src/components/home/IntroSection.tsx',
       './src/components/home/ServicesSection.tsx',
       './src/App.tsx',
       './src/Home.tsx'
     ],
     whitelistClasses: [
       'bg-[#0f1628]',
       'text-white',
       'grid-cols-1',
       'lg:grid-cols-2',
       'backdrop-blur-sm'
     ]
   })
   ```

2. **Extraction Script** (`scripts/extractCriticalCss.js`):
   - Contains similar configuration but can be adjusted independently
   - More extensive whitelist for critical classes

## Performance Impact

This optimization directly addresses one of the Core Web Vitals metrics:
- **Improved First Contentful Paint (FCP)**: By inlining critical CSS, the browser can render the above-the-fold content without waiting for external CSS files to download
- **Reduced Render-Blocking Resources**: The main CSS file is loaded asynchronously and doesn't block rendering
- **Better User Experience**: Users see a styled page faster, reducing perceived load time

## Testing

To verify the optimization is working:

1. Build the application: `npm run build`
2. Check the generated `dist/index.html` file - it should contain an inline `<style id="critical-css">` tag
3. Run performance tests in Lighthouse to verify improved FCP metrics
4. Observe the page load in slow network conditions - the above-the-fold content should appear styled quickly

## Maintenance

When making significant UI changes, particularly to above-the-fold components:

1. Review and update the list of critical components in both:
   - `vite.config.ts`
   - `scripts/extractCriticalCss.js`

2. Consider adjusting the whitelist classes if using new Tailwind utility classes in above-the-fold components

## Troubleshooting

If critical CSS is not working as expected:

1. **Missing CSS rules**: Add the specific classes to the `whitelistClasses` array
2. **Script errors**: Check the build console output for error messages
3. **No improvement in metrics**: Verify the critical CSS is properly inlined and contains all necessary styles for above-the-fold rendering

## Future Improvements

- Implement per-route critical CSS for applications with multiple entry points
- Add automated testing to verify critical CSS coverage
- Consider using [critters](https://github.com/GoogleChromeLabs/critters) for more advanced critical CSS extraction 