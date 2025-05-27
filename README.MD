# UI Component Library

A modern, accessible UI component library for React applications.

## Components

### Status Components

- **StatusIndicator**: Visual indicators for different states (success, warning, error, info)
- **StatusDemo**: Interactive demo showcasing the StatusIndicator component

### Progress Components

- **ProgressBar**: Customizable progress bar with various styles and states
- **ProgressDemo**: Interactive demo showcasing the ProgressBar component

### Notification Components

- **Toast**: Temporary notification messages that appear and disappear automatically
- **ToastContainer**: Container for managing multiple toast notifications
- **NotificationDemo**: Interactive demo showcasing the notification components

## Features

- **Accessible**: All components follow ARIA best practices
- **Customizable**: Extensive props for styling and behavior
- **Responsive**: Works across different screen sizes
- **Dark Mode Support**: Automatic detection of system preferences

## Automated Sitemap Generation

The website automatically generates a `sitemap.xml` file during the build process to ensure search engines can properly index all pages.

### How it works

1. **Build Process**: The `prebuild` script runs before the main build
2. **Dynamic Generation**: Sitemap includes:
   - Static pages (home, services, about, contact, etc.)
   - Blog posts with proper last modified dates
   - Category pages with URL encoding
   - Case study pages
3. **SEO Optimized**: Uses `https://cloudseek.io` as the base URL with proper priorities and change frequencies

### Manual Generation

You can manually generate the sitemap at any time:

```bash
npm run generate-sitemap
```

### Configuration

The sitemap generation script is located at `scripts/generate-sitemap.js` and includes:
- Comprehensive error handling
- Logging for build visibility
- Proper XML formatting
- SEO best practices for priorities and change frequencies

## Getting Started

1. Install the package:
   ```
   npm install ui-component-library
   ```

2. Import and use components:
   ```jsx
   import { StatusIndicator, ProgressBar, Toast, ToastContainer } from 'ui-component-library';

   function App() {
     return (
       <div>
         <StatusIndicator status="success" label="Operation completed successfully" />
         <ProgressBar value={75} label="Download Progress" showValue />
         <ToastContainer position="top-right">
           <Toast type="info" message="Welcome to the application" />
         </ToastContainer>
       </div>
     );
   }
   ```

## Component Documentation

### StatusIndicator

```jsx
<StatusIndicator 
  status="success" // 'success', 'warning', 'error', 'info', 'pending', 'idle', 'running', 'completed'
  label="Operation completed" 
  variant="dot" // 'dot', 'badge', 'pill', 'text'
  size="md" // 'sm', 'md', 'lg'
  pulse={false} // Add pulsing animation
  animated={true} // Enable animations
  enabled={true} // Enable/disable the indicator
/>
```

### ProgressBar

```jsx
<ProgressBar 
  value={75} // Current progress value
  max={100} // Maximum value
  showValue={true} // Show progress value
  valueFormat="percentage" // 'percentage' or 'value'
  animated={true} // Animate the progress bar
  striped={false} // Show striped pattern
  variant="default" // 'default', 'success', 'warning', 'error', 'info'
  size="md" // 'sm', 'md', 'lg'
  label="Download Progress" // Label above progress bar
  description="Downloading file..." // Description below progress bar
  indeterminate={false} // Indeterminate state
  onComplete={() => console.log('Complete!')} // Callback on completion
/>
```

### Toast Notifications

```jsx
// Toast Container
<ToastContainer
  position="top-right" // 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
  autoClose={5000} // Auto close timeout in ms, set to false to disable
  limit={5} // Maximum number of toasts displayed at once
/>

// Creating a toast
<Toast
  type="success" // 'success', 'error', 'warning', 'info'
  message="Operation completed successfully"
  title="Success" // Optional title
  autoClose={5000} // Override container's autoClose
  closable={true} // Allow manually closing
/>
```

## License

MIT
