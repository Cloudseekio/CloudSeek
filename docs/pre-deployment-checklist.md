# Pre-Deployment Checklist Guide

This guide explains how to use the pre-deployment checklist script to verify your website is ready for production deployment.

## Overview

The pre-deployment checklist script (`scripts/pre-check.js`) runs a comprehensive series of automated checks to ensure your website meets quality standards before deployment, including:

1. **Asset Optimization** - Verifies images, JavaScript, and CSS are properly optimized
2. **Console.log Detection** - Identifies `console.log` statements that should be removed from production
3. **Meta Tag and Schema Validation** - Checks for proper SEO tags and structured data
4. **Lighthouse Score Verification** - Runs Lighthouse and checks against score thresholds
5. **Critical User Flow Testing** - Verifies key user journeys function correctly
6. **Broken Link Detection** - Checks for broken links and image references

## Prerequisites

Before running the script, you need to install the required dependencies:

```bash
npm install puppeteer lighthouse html-validator sharp glob chalk
```

These dependencies have been added to your `package.json` file.

## Running the Script

You can run the pre-deployment checklist in two ways:

### 1. As a standalone check

```bash
npm run pre-check
```

This will run all checks and provide a detailed report.

### 2. As part of the build process

The script is automatically integrated into the build process via the `prebuild` script in `package.json`:

```bash
npm run build
```

This will run the pre-check script before building the application, ensuring that your build fails if critical issues are detected.

## Configuration

The script's configuration can be modified by editing the `config` object in `scripts/pre-check.js`:

- `baseUrl`: The URL to check (default: `http://localhost:5173`)
- `lighthouseThresholds`: Minimum scores required for each Lighthouse category
- `jsFilesToCheck`: Glob patterns for finding JavaScript/TypeScript files
- `criticalFlows`: Key user journeys to verify
- `assetChecks`: Parameters for image optimization checks

## Understanding the Results

The script outputs a detailed report with:

### Status Indicators

- ✅ **Green check marks**: Passed checks
- ⚠️ **Yellow warnings**: Issues that should be reviewed but don't block deployment
- ❌ **Red X marks**: Failed checks that should be fixed before deployment

### Summary Report

At the end of the run, you'll see a summary showing:
- Number of passed checks
- Number of warnings
- Number of failed checks
- Detailed error and warning messages

A JSON report is also saved to `pre-deployment-report.json` with full details.

## What's Being Checked

### 1. Asset Optimization

- Image sizes and formats (checks for WebP versions)
- Image dimensions (flags extremely large images)
- JS/CSS minification

### 2. Console.log Detection

- Scans JavaScript/TypeScript files for `console.log` statements
- Excludes test files
- Reports file locations with console logs

### 3. Meta Tags and Schema Validation

- Checks for required meta tags (`description`, OpenGraph tags, etc.)
- Validates JSON-LD schema markup
- Ensures structured data is properly formatted

### 4. Lighthouse Scores

- Performance (threshold: 80)
- Accessibility (threshold: 90)
- Best Practices (threshold: 85)
- SEO (threshold: 90)

### 5. Critical User Flows

- Tests navigation to key pages
- Checks for JavaScript errors and error boundaries
- Verifies HTTP status codes

### 6. Broken Links

- Scans all internal links and images on the homepage
- Tests that each URL returns a valid response
- Reports broken resources with their status codes

## Troubleshooting

### Common Issues

1. **Server not starting**: 
   - Check that the development server can run with `npm run preview`
   - Verify the port configuration matches the `baseUrl` setting

2. **Lighthouse failures**:
   - Examine the `lighthouse-report.json` file for detailed suggestions
   - Focus on fixing the most impactful issues first

3. **Permission errors**:
   - On some systems, Puppeteer may require additional permissions
   - Try running with administrator/root privileges if needed

### Customizing Checks

You can modify the script to add custom checks specific to your application:

1. **Add new checks**: Create additional functions following the same pattern as existing checks
2. **Add custom flows**: Expand the `criticalFlows` array with key user journeys
3. **Adjust thresholds**: Modify score thresholds based on project requirements

## Best Practices

- Run the pre-check script regularly during development, not just before deployment
- Address warnings proactively even though they don't cause build failures
- Update thresholds gradually as you improve your application
- Add custom checks for business-critical functionality specific to your application

## Extending the Script

The script can be extended with additional checks:

1. **Accessibility Testing**: Add more detailed accessibility checks 
2. **Performance Budget**: Define and check against performance budgets
3. **Custom Analytics**: Track improvement trends over time
4. **Internationalization**: Verify translations and localization
5. **Security Checks**: Add basic security verification

To add custom checks, create new functions in the script and call them from the `runAllChecks` function. 