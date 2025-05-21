# Enhanced Skeleton Loading Components

This library provides highly customizable, content-aware skeleton loading components that deliver an improved user experience during loading states.

## Key Features

- **Content-Aware Placeholders**: Match the exact dimensions and layout of your actual components
- **Multiple Animation Types**: Choose between pulse, shimmer, wave, or no animation
- **Accessibility-First**: Proper ARIA attributes, screen reader support, and respects reduced motion preferences
- **Dark Mode Compatible**: Works seamlessly with both light and dark themes
- **Highly Customizable**: Extensive props for fine-tuning appearance and behavior
- **Pre-built Component Skeletons**: Ready-to-use skeletons for common components like BlogCard and HeroSection

## Components

### SkeletonBase

The foundation component that provides styling and animation. All other skeleton components use this internally.

```jsx
<SkeletonBase 
  animate="shimmer" 
  className="h-12 w-full rounded-lg" 
/>
```

### SkeletonText

For text content with support for multiple lines and varying widths.

```jsx
<SkeletonText
  lines={3}
  width={["100%", "80%", "60%"]}
  fontSize="lg"
  isHeading={true}
  animate="wave"
/>
```

### SkeletonImage

For image placeholders with aspect ratio support.

```jsx
<SkeletonImage
  width="100%"
  aspectRatio={16/9}
  rounded="lg"
  showIcon={true}
  animate="pulse"
/>
```

### SkeletonList

For lists of repeating items.

```jsx
<SkeletonList
  count={5}
  gap={4}
  layout="grid"
  columns={3}
  itemHeight="8rem"
  animate="shimmer"
/>
```

### BlogCardSkeleton

Matches the exact layout of the BlogCard component.

```jsx
<BlogCardSkeleton
  animate="shimmer"
  imageAspectRatio={16/9}
  showCategory={true}
/>
```

### HeroSectionSkeleton

Matches the layout of the HeroSection component.

```jsx
<HeroSectionSkeleton
  animate="shimmer"
  showDashboards={true}
/>
```

## Animation Types

- **pulse**: Smoothly fades in and out (default in Tailwind)
- **shimmer**: Gradient that moves horizontally across the element
- **wave**: Opacity that changes in a wave pattern
- **none**: No animation (accessible setting)

## Usage with LoadingFallback

The `LoadingFallback` component has been enhanced to use these skeleton components:

```jsx
// Default loading
<LoadingFallback />

// Full page loading
<LoadingFallback type="page" message="Loading application..." />

// Card loading
<LoadingFallback type="card" animation="shimmer" />

// Blog grid loading
<LoadingFallback type="blog" cardCount={6} animation="shimmer" />

// Hero section loading
<LoadingFallback type="hero" animation="pulse" />
```

## Accessibility Features

- All components use appropriate ARIA attributes (`role="status"`, `aria-busy="true"`, `aria-live="polite"`)
- Screen-reader only text describes what's loading
- Animations disable automatically when user prefers reduced motion
- High contrast between skeleton and background colors

## Tips for Using Skeletons Effectively

1. **Match Dimensions**: Make skeletons match the size of the actual content as closely as possible.
2. **Use Content-Awareness**: Vary the width of text lines to mimic real text patterns.
3. **Maintain Visual Hierarchy**: If your content has headers followed by text, reflect this in your skeletons.
4. **Keep It Simple**: Don't add too much detail - skeletons should be simple abstractions.
5. **Consistency**: Use the same animation style throughout your application for a cohesive feel.