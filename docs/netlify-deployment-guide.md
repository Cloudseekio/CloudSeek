# Netlify Deployment Guide for CloudSeek Website

This guide documents the simplified deployment setup for the CloudSeek website on Netlify, using standard Vite build processes without custom scripts.

## Table of Contents

- [Simplified Build Process](#simplified-build-process)
- [Key Changes](#key-changes)
- [netlify.toml Configuration](#netlifytoml-configuration)
- [Security Headers](#security-headers)
- [Troubleshooting](#troubleshooting)

## Simplified Build Process

We've moved to a simplified, standard build process that eliminates complexity and potential dependency issues:

### What Changed

1. **Removed Custom Scripts**
   - Eliminated all `netlify-*` scripts that caused dependency conflicts
   - Removed Node.js-only scripts that contaminated the browser bundle
   - Simplified to use standard `npm run build` command

2. **Fixed CommonJS Issues**
   - Removed Node.js-only dependencies (pexels, webpack packages, etc.)
   - Replaced external script dependencies with browser-compatible alternatives
   - Fixed `require is not defined` errors in the browser

3. **Standard Vite Build**
   - Uses standard `npm install && npm run build` command
   - No legacy peer dependencies flag needed
   - Clean build process without custom post-processing

## Key Changes

### Before (Problematic)
```toml
[build]
  command = "npm install --legacy-peer-deps && npm run netlify-build"
```

### After (Fixed)
```toml
[build]
  command = "npm install && npm run build"
```

## netlify.toml Configuration

Current simplified configuration:

```toml
# Build settings
[build]
  command = "npm install && npm run build"
  publish = "dist"

# Environment variables
[build.environment]
  NODE_ENV = "production"
  NETLIFY_USE_YARN = "false"
  NETLIFY_USE_PNPM = "false"
  NETLIFY_USE_NPM = "true"

# Redirects for SPA
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers for security and caching
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.google-analytics.com https://ssl.google-analytics.com data: blob:; script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com; connect-src 'self' https://*.google-analytics.com https://ssl.google-analytics.com https://www.google-analytics.com https://api.cloudseek.io https://*.netlify.app; img-src 'self' data: https://*.google-analytics.com https://ssl.google-analytics.com https://www.google-analytics.com https://images.ctfassets.net https://via.placeholder.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; object-src 'none'; frame-src 'self'; manifest-src 'self';"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), geolocation=(), microphone=()"

# Cache control for assets
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Development settings
[dev]
  command = "npm run dev"
  port = 5173
  targetPort = 5173
  publish = "dist"
```

## Security Headers

The configuration includes comprehensive security headers:

- **X-Frame-Options**: Prevents clickjacking attacks
- **X-XSS-Protection**: Enables XSS filtering
- **Content-Security-Policy**: Restricts resource loading to trusted sources
- **Strict-Transport-Security**: Enforces HTTPS connections
- **Cache-Control**: Optimizes caching for static assets

## Troubleshooting

### Common Issues and Solutions

1. **Build Failures**
   - Check that the build works locally with `npm run build`
   - Ensure all imports are ES modules, not CommonJS
   - Verify no Node.js-only dependencies are being used in frontend code

2. **Missing Dependencies**
   - Run `npm install` locally to verify package.json is correct
   - Check that all dependencies are properly listed in package.json

3. **Environment Variables**
   - Environment variables are optional and have fallback values
   - Set Contentful variables in Netlify dashboard if using real content

4. **Blank Page Issues**
   - Check browser console for JavaScript errors
   - Verify all routes are properly configured
   - Ensure SPA redirects are working (configured in netlify.toml)

### Local Testing

To test the exact build process that Netlify uses:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build
npm run build

# Preview
npm run preview
```

### Deployment Verification

After deployment:
1. Check cloudseek.io loads without errors
2. Verify browser console has no JavaScript errors
3. Test navigation between pages
4. Confirm all assets load correctly

The simplified build process eliminates previous complexity and should deploy reliably on Netlify without custom scripts or dependency workarounds. 