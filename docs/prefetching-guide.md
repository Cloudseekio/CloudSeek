# Intelligent Prefetching System

This guide explains how to use our smart prefetching system to dramatically improve perceived loading performance in your React application.

## Table of Contents

- [Introduction](#introduction)
- [Benefits of Intelligent Prefetching](#benefits-of-intelligent-prefetching)
- [How It Works](#how-it-works)
- [Using the `usePrefetch` Hook](#using-the-useprefetch-hook)
- [Configuration Options](#configuration-options)
- [Prefetching Methods](#prefetching-methods)
- [Network-Aware Prefetching](#network-aware-prefetching)
- [Advanced Usage](#advanced-usage)
- [Best Practices](#best-practices)
- [Performance Metrics](#performance-metrics)
- [Troubleshooting](#troubleshooting)

## Introduction

Intelligent prefetching is a technique that loads pages before a user clicks on them, making navigation feel instantaneous. Our implementation combines multiple prefetching strategies and adapts to network conditions for an optimal user experience without wasting bandwidth.

## Benefits of Intelligent Prefetching

- **Dramatically improved navigation speed**: Pages load instantly when clicked because they're already preloaded
- **Better perceived performance**: Users experience faster, smoother transitions
- **Reduced bounce rates**: Faster navigation means fewer users abandoning your site
- **Network-aware**: Automatically adapts prefetching behavior based on connection quality
- **Bandwidth efficient**: Only prefetches what's likely to be needed

## How It Works

Our prefetching system combines five intelligent strategies:

1. **Predictive prefetching**: Analyzes navigation patterns to predict where users will go next
2. **Viewport-based prefetching**: Prefetches links as they enter the viewport (visible area)
3. **Hover-based prefetching**: Prefetches when users hover over links (showing intent)
4. **Analytics-driven**: Uses historical analytics data to optimize prefetch decisions
5. **Network-aware**: Adjusts prefetching aggressiveness based on connection quality

This multi-strategy approach ensures pages are ready before users click, while respecting their bandwidth and device capabilities.

## Using the `usePrefetch` Hook

The `usePrefetch` hook is the central API for the prefetching system:

```tsx
import { usePrefetch } from '../hooks/usePrefetch';

function MyComponent() {
  const {
    networkQuality,
    prefetch,
    getPrefetchedRoutes,
    clearPrefetchCache,
    navigate,
    currentPath
  } = usePrefetch({
    // Configuration options (see below)
    enableHover: true,
    enableViewport: true,
    enablePrediction: true,
    debug: process.env.NODE_ENV !== 'production'
  });
  
  // Manually prefetch an important route
  useEffect(() => {
    prefetch('/important-page');
  }, [prefetch]);
  
  return (
    <div>
      <p>Current network quality: {networkQuality}</p>
      <button onClick={() => navigate('/about')}>
        Go to About
      </button>
    </div>
  );
}
```

## Configuration Options

The `usePrefetch` hook accepts a configuration object with these options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Master switch to enable/disable all prefetching |
| `enableHover` | boolean | `true` | Enable hover-based prefetching |
| `hoverDelay` | number | `100` | Delay in milliseconds before prefetching on hover |
| `enableViewport` | boolean | `true` | Enable prefetching for links in viewport |
| `viewportThreshold` | number | `0.5` | How much of the link must be visible (0-1) |
| `enablePrediction` | boolean | `true` | Enable predictive prefetching |
| `predictionThreshold` | number | `0.3` | Probability threshold for prediction (0-1) |
| `maxPrefetchCount` | number | `5` | Maximum number of routes to prefetch at once |
| `networkThresholds` | object | *see below* | Network quality thresholds for each method |
| `debug` | boolean | `false` | Enable debug logging |
| `prefetchFunction` | function | `undefined` | Custom prefetch implementation |
| `onPrefetchStart` | function | `undefined` | Callback when prefetch starts |
| `onPrefetchSuccess` | function | `undefined` | Callback when prefetch succeeds |
| `onPrefetchError` | function | `undefined` | Callback when prefetch fails |

Default network thresholds:
```js
{
  prediction: 'slow',   // Predictive prefetching even on slow connections
  viewport: 'medium',   // Viewport prefetching on medium or better connections
  hover: 'fast',        // Hover prefetching only on fast connections
}
```

## Prefetching Methods

### Predictive Prefetching

This method tracks user navigation patterns and predicts likely destinations:

```tsx
const { prefetch } = usePrefetch({
  enablePrediction: true,
  predictionThreshold: 0.3, // Minimum probability score (0-1)
});
```

### Viewport-Based Prefetching

This method prefetches links as they come into view:

```tsx
const { prefetch } = usePrefetch({
  enableViewport: true,
  viewportThreshold: 0.5, // How much of the link must be visible (0-1)
});
```

### Hover-Based Prefetching

This method prefetches links when users hover over them:

```tsx
const { prefetch } = usePrefetch({
  enableHover: true,
  hoverDelay: 100, // Milliseconds to wait before prefetching on hover
});
```

### Manual Prefetching

You can also manually prefetch routes:

```tsx
const { prefetch } = usePrefetch();

// Prefetch a specific route
prefetch('/about');

// Prefetch an array of routes
['/', '/about', '/contact'].forEach(prefetch);
```

## Network-Aware Prefetching

The hook automatically adapts prefetching behavior based on network conditions:

```tsx
const { prefetch, networkQuality } = usePrefetch({
  // Configure network quality thresholds for each method
  networkThresholds: {
    prediction: 'slow',   // Run even on slow connections
    viewport: 'medium',   // Only on medium or better connections
    hover: 'fast',        // Only on fast connections
  }
});

// networkQuality will be one of: 'fast', 'medium', 'slow', or 'offline'
console.log(`Current network quality: ${networkQuality}`);
```

The system detects network quality using:

- `navigator.connection` for detailed network info when available
- Download speeds and RTT (round-trip time)
- Connection effective type (4g, 3g, 2g, etc.)
- Data saver mode preferences
- Online/offline status

## Advanced Usage

### Custom Prefetch Function

You can provide your own prefetch implementation:

```tsx
const { prefetch } = usePrefetch({
  prefetchFunction: async (path) => {
    // Custom prefetching logic
    // For example, using Next.js router prefetch:
    router.prefetch(path);
  }
});
```

### Prefetch Events

Monitor and log prefetch activity:

```tsx
const { prefetch } = usePrefetch({
  onPrefetchStart: (path, method) => {
    console.log(`Started prefetching ${path} via ${method}`);
    // Record prefetch start in analytics
  },
  
  onPrefetchSuccess: (path, method) => {
    console.log(`Successfully prefetched ${path} via ${method}`);
    // Record prefetch success in analytics
  },
  
  onPrefetchError: (path, error, method) => {
    console.error(`Failed to prefetch ${path} via ${method}:`, error);
    // Record prefetch failure in analytics
  }
});
```

### Clearing the Prefetch Cache

You can clear the prefetch cache manually:

```tsx
const { clearPrefetchCache } = usePrefetch();

// Clear all prefetched routes
clearPrefetchCache();
```

## Best Practices

1. **Don't overprefetch**: Limit `maxPrefetchCount` to avoid wasting bandwidth
2. **Respect user data**: Adjust thresholds based on network conditions
3. **Prefetch critical routes**: Manually prefetch the most important routes
4. **Monitor performance**: Track the impact of prefetching on your metrics
5. **Balance aggressiveness**: More aggressive prefetching can improve performance but use more data
6. **Adjust based on page type**: Use different settings for different sections of your app
7. **Reset prefetch cache on logout**: Clear cached data when user state changes significantly

## Performance Metrics

To measure the effectiveness of prefetching:

1. **Time To Interactive (TTI)**: Should decrease for prefetched pages
2. **Navigation timing**: Use the Performance API to measure navigation improvements
3. **Bounce rate**: Should decrease as navigation feels faster
4. **Page views per session**: Should increase due to faster browsing experience

Sample measurement code:

```tsx
const { prefetch, navigate } = usePrefetch();

// Measure navigation performance
const handleClick = (path) => {
  const startTime = performance.now();
  
  // Navigate to the path
  navigate(path);
  
  // In the target component's useEffect:
  useEffect(() => {
    const loadTime = performance.now() - startTime;
    console.log(`Navigation to ${path} took ${loadTime}ms`);
    
    // Log to analytics
    trackEvent('navigation_performance', {
      path,
      loadTime,
      wasPrefetched: /* check if it was prefetched */
    });
  }, []);
};
```

## Troubleshooting

### Prefetching Not Working

1. **Check your browser console**: Enable debug mode to see prefetch activity
2. **Network monitor**: Check if prefetch requests are being made
3. **CORS issues**: Ensure your server allows prefetching requests
4. **Service worker interference**: Make sure service workers are correctly handling prefetch requests

### High Bandwidth Usage

1. Reduce `maxPrefetchCount` to limit concurrent prefetches
2. Make `networkThresholds` more conservative
3. Disable `enablePrediction` or increase `predictionThreshold`
4. Add `saveData` detection to disable prefetching when data saver is on

### Memory Leaks

1. Ensure the component using `usePrefetch` properly cleans up on unmount
2. Call `clearPrefetchCache()` when appropriate (e.g., on logout)
3. Don't create multiple instances of `usePrefetch` unnecessarily

## Integration Examples

### With React Router

The hook works seamlessly with React Router:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { usePrefetch } from '../hooks/usePrefetch';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const { networkQuality } = usePrefetch();
  
  return (
    <div>
      {networkQuality !== 'offline' ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* More routes */}
        </Routes>
      ) : (
        <OfflineFallback />
      )}
    </div>
  );
}
```

### With a Global Navigation Component

```tsx
function Navigation() {
  const { currentPath } = usePrefetch();
  
  return (
    <nav>
      <NavLink to="/" active={currentPath === "/"}>Home</NavLink>
      <NavLink to="/about" active={currentPath === "/about"}>About</NavLink>
      <NavLink to="/contact" active={currentPath === "/contact"}>Contact</NavLink>
    </nav>
  );
}
```

By implementing this intelligent prefetching system, you can significantly improve perceived performance, creating a smoother, more responsive user experience. 