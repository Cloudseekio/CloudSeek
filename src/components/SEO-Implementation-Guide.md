# CloudSeek SEO Component Implementation Guide

This guide explains how to use the enhanced SEO component to implement schema.org JSON-LD markup for different page types in the CloudSeek website.

## Table of Contents

1. [Introduction](#introduction)
2. [Basic SEO Implementation](#basic-seo-implementation)
3. [Schema Types](#schema-types)
   - [Organization Schema](#organization-schema)
   - [WebPage Schema](#webpage-schema)
   - [BlogPosting Schema](#blogposting-schema)
   - [Service Schema](#service-schema)
   - [FAQPage Schema](#faqpage-schema)
4. [Canonical URLs and Alternate Links](#canonical-urls-and-alternate-links)
5. [Implementation Examples](#implementation-examples)
6. [Best Practices](#best-practices)

## Introduction

The CloudSeek SEO component is built on `react-helmet-async` and provides a comprehensive solution for managing SEO metadata, OpenGraph tags, Twitter cards, and structured data (JSON-LD) for different page types. The component automatically generates the appropriate schema.org markup based on the page type and the provided props.

## Basic SEO Implementation

To add basic SEO metadata to any page, import the SEO component and use it as follows:

```tsx
import SEO from '../components/SEO';

const AboutPage = () => {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about CloudSeek, a leading Salesforce implementation partner."
        canonical="/about"
        image="/images/about-hero.jpg"
      />
      {/* Page content */}
    </>
  );
};
```

This will generate the following metadata:
- Title tag (`<title>About Us | CloudSeek</title>`)
- Meta description
- Canonical URL
- OpenGraph and Twitter card tags
- Basic WebPage schema.org markup

## Schema Types

The SEO component supports multiple schema.org types through the `type` prop and specialized prop objects.

### Organization Schema

The Organization schema is automatically included in all pages to provide consistent company information. You don't need to explicitly add it.

### WebPage Schema

The WebPage schema is the default schema type. It's automatically generated for any page where a more specific type isn't specified.

```tsx
<SEO
  title="About Us"
  description="Learn about CloudSeek, a leading Salesforce implementation partner."
  canonical="/about"
  image="/images/about-hero.jpg"
  type="website" // default value
/>
```

### BlogPosting Schema

For blog posts, use the `type="article"` prop and provide additional blog-specific metadata:

```tsx
<SEO
  title="10 Best Practices for Salesforce Implementation"
  description="Discover the 10 essential best practices for a successful Salesforce implementation."
  canonical="/blog/salesforce-implementation-best-practices"
  image="/images/blog/salesforce-implementation.jpg"
  type="article"
  publishDate="2025-03-15T08:00:00Z"
  modifiedDate="2025-03-17T10:30:00Z"
  author="Jane Smith"
  blogPostDetails={{
    title: "10 Best Practices for Salesforce Implementation",
    description: "Discover the 10 essential best practices for a successful Salesforce implementation.",
    author: "Jane Smith",
    publishDate: "2025-03-15T08:00:00Z",
    modifiedDate: "2025-03-17T10:30:00Z",
    image: "/images/blog/salesforce-implementation.jpg",
    url: "/blog/salesforce-implementation-best-practices",
    categories: ["Implementation", "Best Practices"],
    tags: ["Salesforce", "CRM", "Implementation", "Best Practices"]
  }}
/>
```

### Service Schema

For service pages, use the `type="service"` prop and provide service-specific details:

```tsx
<SEO
  title="Salesforce Implementation Services"
  description="Enterprise-grade Salesforce implementation services tailored to your business needs."
  canonical="/services/salesforce-implementation"
  image="/images/services/implementation.jpg"
  type="service"
  serviceDetails={{
    name: "Salesforce Implementation Services",
    description: "Complete end-to-end Salesforce implementation services tailored to your business needs",
    provider: "CloudSeek",
    areaServed: "Global",
    serviceType: "Salesforce Implementation",
    image: "/images/services/implementation.jpg"
  }}
/>
```

### FAQPage Schema

For FAQ pages, use the `type="faq"` prop and provide an array of question-answer pairs:

```tsx
const faqItems = [
  {
    question: "What is Salesforce?",
    answer: "Salesforce is a cloud-based customer relationship management (CRM) platform that helps businesses manage their sales, customer service, marketing automation, and analytics in one place."
  },
  {
    question: "How long does a typical Salesforce implementation take?",
    answer: "A typical Salesforce implementation can take anywhere from 2 weeks to 6 months, depending on the complexity of your requirements, the size of your organization, and the level of customization needed."
  }
  // Add more FAQ items as needed
];

<SEO
  title="Frequently Asked Questions"
  description="Find answers to common questions about Salesforce implementation, customization, and our services."
  canonical="/faq"
  image="/images/faq-banner.jpg"
  type="faq"
  faqItems={faqItems}
/>
```

## Canonical URLs and Alternate Links

The SEO component supports enhanced canonical URL handling and alternate links for multilingual content:

```tsx
const alternateLinks = [
  { href: "https://cloudseek.io/services", hrefLang: "en-US" },
  { href: "https://cloudseek.io/es/servicios", hrefLang: "es" },
  { href: "https://cloudseek.io/fr/services", hrefLang: "fr" },
  { href: "https://cloudseek.io/ar/services", hrefLang: "ar" },
  { href: "https://cloudseek.io/services", hrefLang: "x-default" }
];

<SEO
  title="Our Services"
  description="Explore CloudSeek's comprehensive Salesforce services."
  canonical="/services"
  image="/images/services-hero.jpg"
  locale="en-US"
  alternateLinks={alternateLinks}
/>
```

If no alternate links are provided, the component will create a default one based on the current locale.

## Implementation Examples

### Real-world FAQPage Implementation

Here's an example of how to integrate the SEO component with the existing FAQPage component:

```tsx
import React, { useState } from 'react';
import SEO from '../components/SEO';
import './FAQPage.css';

const FAQPage = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // FAQ data organized by category
  const faqData = {
    "General": [
      {
        id: "what-is-salesforce",
        question: "What is Salesforce?",
        answer: "Salesforce is a cloud-based customer relationship management (CRM) platform that helps businesses manage their sales, customer service, marketing automation, and analytics in one place."
      },
      // More questions...
    ],
    "Implementation": [
      {
        id: "implementation-time",
        question: "How long does a typical Salesforce implementation take?",
        answer: "A typical Salesforce implementation can take anywhere from 2 weeks to 6 months, depending on the complexity of your requirements, the size of your organization, and the level of customization needed."
      },
      // More questions...
    ]
    // More categories...
  };

  // Flatten FAQ data for SEO schema
  const faqItems = Object.values(faqData).flat().map(item => ({
    question: item.question,
    answer: item.answer
  }));

  return (
    <div className="faq-page">
      <SEO
        title="Frequently Asked Questions"
        description="Find answers to common questions about Salesforce implementation, customization, and our services."
        canonical="/faq"
        image="/images/faq-banner.jpg"
        type="faq"
        faqItems={faqItems}
      />
      
      <h1>Frequently Asked Questions</h1>
      
      {Object.entries(faqData).map(([category, items]) => (
        <div key={category} className="faq-category">
          <h2>{category}</h2>
          <div className="faq-items">
            {items.map(item => (
              <div 
                key={item.id} 
                className={`faq-item ${openItems[item.id] ? 'open' : ''}`}
              >
                <div 
                  className="faq-question" 
                  onClick={() => toggleItem(item.id)}
                >
                  <h3>{item.question}</h3>
                  <span className="faq-icon">
                    {openItems[item.id] ? '−' : '+'}
                  </span>
                </div>
                {openItems[item.id] && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQPage;
```

## Best Practices

1. **Always include a canonical URL** - This helps search engines understand the preferred version of a page and prevents duplicate content issues.

2. **Use specific schema types** when appropriate - Different content requires different schema types. Using the appropriate schema helps search engines understand and display your content correctly.

3. **Provide detailed metadata** - The more information you provide, the better search engines can understand and rank your content.

4. **Keep title and description lengths optimal**:
   - Titles: 50-60 characters
   - Descriptions: 150-160 characters

5. **Include alternate links for multilingual content** - This helps search engines understand the relationship between different language versions of your content.

6. **Use high-quality images** - OpenGraph and Twitter cards use your images in social media shares. Make sure they're high quality and properly sized (recommended: 1200x630 pixels).

7. **Update schema when content changes** - Make sure to update the publishDate and modifiedDate properties when content changes.

8. **Test your structured data** using Google's Structured Data Testing Tool or Rich Results Test.

9. **Monitor search console** for any errors related to structured data and fix them promptly.

10. **Keep schema.org markup updated** as standards evolve over time.

# Advanced Structured Data Implementation Guide for SEO Component

This guide explains how to leverage advanced structured data schemas in our SEO component to improve search engine visibility and enhance rich results in search engine result pages (SERPs).

## Table of Contents

1. [Introduction](#introduction)
2. [BreadcrumbList Schema](#breadcrumblist-schema)
3. [Enhanced Article Schema](#enhanced-article-schema)
4. [FAQ Schema](#faq-schema)
5. [VideoObject Schema](#videoobject-schema)
6. [Review Schema](#review-schema)
7. [Combining Multiple Schemas](#combining-multiple-schemas)
8. [Testing Your Structured Data](#testing-your-structured-data)

## Introduction

Our enhanced SEO component now supports several advanced schema.org structured data types that can significantly improve how search engines understand and display your content. This implementation follows schema.org specifications and Google's structured data guidelines.

## BreadcrumbList Schema

Breadcrumb navigation helps users understand their location within your website and improves SEO by establishing clear hierarchical relationships between pages.

### Implementation

```tsx
<SEO
  title="Product Page Title"
  description="Product description"
  breadcrumbs={[
    { name: 'Home', url: '/', position: 1 },
    { name: 'Products', url: '/products', position: 2 },
    { name: 'Product Name', url: '/products/product-name', position: 3 }
  ]}
/>
```

### Best Practices

- Always include breadcrumbs for pages that are at least 2 levels deep in your site hierarchy
- Ensure position numbers are sequential starting from 1
- Use consistent naming conventions across your site
- Include the current page as the last item in the breadcrumb

## Enhanced Article Schema

Article schema gives search engines detailed information about your articles, blog posts, and news content, enabling rich results like headline text, publication dates, and author information.

### Implementation

```tsx
<SEO
  type="article"
  title="Blog Post Title"
  description="Blog post description"
  publishDate="2023-06-15T08:00:00Z"
  modifiedDate="2023-06-20T10:30:00Z"
  blogPostDetails={{
    title: "Blog Post Title",
    description: "Blog post description",
    author: "Author Name",
    publishDate: "2023-06-15T08:00:00Z",
    modifiedDate: "2023-06-20T10:30:00Z",
    image: "/images/blog/post-image.jpg",
    url: "/blog/post-slug",
    categories: ["Category1", "Category2"],
    tags: ["Tag1", "Tag2", "Tag3"],
    // Enhanced author details
    authorDetails: {
      name: "Author Name",
      url: "https://example.com/authors/author-name",
      image: "/images/team/author-image.jpg",
      jobTitle: "Author Job Title",
      sameAs: [
        "https://www.linkedin.com/in/author-name",
        "https://twitter.com/authorname"
      ]
    }
  }}
/>
```

### Best Practices

- Always include dates in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ)
- Include comprehensive author information to enhance author credibility
- Use high-quality featured images (at least 1200x630px)
- Categorize and tag articles consistently

## FAQ Schema

FAQ schema helps search engines understand questions and answers on your page, potentially displaying them directly in search results as rich snippets.

### Implementation

```tsx
<SEO
  title="Frequently Asked Questions"
  description="Answers to common questions"
  faqItems={[
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day money-back guarantee on all our products."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within the continental US."
    }
  ]}
/>
```

### Best Practices

- Keep questions concise and direct
- Provide clear, comprehensive answers
- Use natural language for questions (how people actually ask them)
- Organize questions in logical groups
- Keep FAQ schema relevant to the page content

## VideoObject Schema

VideoObject schema helps search engines understand your video content, potentially displaying video thumbnails, durations, and other information directly in search results.

### Implementation

```tsx
<SEO
  title="Video Title"
  description="Video description"
  type="video"
  videoDetails={{
    name: "Video Title",
    description: "Detailed video description",
    thumbnailUrl: "/images/videos/thumbnail.jpg",
    uploadDate: "2023-07-10T14:00:00Z",
    embedUrl: "https://www.youtube.com/embed/video-id",
    contentUrl: "https://example.com/videos/video-file.mp4", // Optional direct file URL
    duration: "PT8M30S" // 8 minutes 30 seconds in ISO 8601 format
  }}
/>
```

### Best Practices

- Use ISO 8601 duration format (PT1H30M15S for 1 hour, 30 minutes, 15 seconds)
- Provide high-quality thumbnails (at least 1200x630px)
- Include both embedUrl and contentUrl when possible
- Ensure video title and description are descriptive and keyword-rich
- Always include upload date in ISO 8601 format

## Review Schema

Review schema enables search engines to understand reviews and ratings on your site, potentially displaying star ratings in search results.

### Implementation

```tsx
<SEO
  title="Product Review"
  description="Review description"
  type="review"
  reviewDetails={{
    name: "Review Title",
    reviewBody: "Detailed review content that provides value to readers...",
    ratingValue: 4.5,
    datePublished: "2023-05-20T09:00:00Z",
    author: {
      name: "Reviewer Name",
      jobTitle: "Relevant Credential",
      url: "https://example.com/reviewer",
      image: "/images/reviewers/reviewer.jpg"
    },
    itemReviewed: {
      name: "Product or Service Name",
      type: "Product", // Or "Service", "Organization", etc.
      image: "/images/products/product.jpg"
    }
  }}
/>
```

### Best Practices

- Use specific rating values between 1-5
- Include detailed review content
- Provide reviewer credentials when applicable
- Clearly identify what is being reviewed
- Ensure reviews are authentic and follow Google's guidelines

## Combining Multiple Schemas

Our enhanced SEO component supports combining multiple schemas on the same page. This is useful for complex pages that contain different types of content.

### Implementation

```tsx
<SEO
  title="Case Study: Client Success Story"
  description="Learn how we helped Client X achieve Y results"
  // Primary type
  type="article"
  publishDate="2023-04-12T10:00:00Z"
  // Add article schema
  blogPostDetails={{
    title: "Case Study: Client Success Story",
    description: "Learn how we helped Client X achieve Y results",
    author: "Author Name",
    publishDate: "2023-04-12T10:00:00Z",
    image: "/images/case-studies/client-x.jpg",
    url: "/case-studies/client-x",
    categories: ["Case Study", "Industry"],
  }}
  // Add video schema
  videoDetails={{
    name: "Client X Success Story",
    description: "Watch how Client X achieved Y results with our solution.",
    thumbnailUrl: "/images/case-studies/client-x-video.jpg",
    uploadDate: "2023-04-15T14:00:00Z",
    embedUrl: "https://www.youtube.com/embed/video-id",
  }}
  // Add testimonial/review schema
  reviewDetails={{
    name: "Client X Review",
    reviewBody: "The solution transformed our operations completely...",
    ratingValue: 5,
    datePublished: "2023-04-20T09:00:00Z",
    author: {
      name: "Client Representative",
      jobTitle: "Director of Operations, Client X",
    },
    itemReviewed: {
      name: "Our Service",
      type: "Service"
    }
  }}
  // Add FAQs
  faqItems={[
    {
      question: "What challenges did Client X face?",
      answer: "Client X was struggling with...",
    },
    {
      question: "What solution did you implement?",
      answer: "We implemented..."
    }
  ]}
  // Add breadcrumbs
  breadcrumbs={[
    { name: 'Home', url: '/', position: 1 },
    { name: 'Case Studies', url: '/case-studies', position: 2 },
    { name: 'Client X', url: '/case-studies/client-x', position: 3 }
  ]}
/>
```

### Best Practices

- Prioritize the most relevant schema type for the page's primary content
- Ensure all schemas accurately represent page content
- Don't overuse schemas - only include relevant ones
- Test combined schemas to ensure they validate properly

## Testing Your Structured Data

Always test your structured data implementation using:

1. [Google's Rich Results Test](https://search.google.com/test/rich-results)
2. [Schema.org Validator](https://validator.schema.org/)

The SEO component automatically outputs properly formatted JSON-LD, but it's still a good practice to validate that the generated markup meets all requirements.

## Additional Resources

- [Schema.org Full Documentation](https://schema.org/docs/full.html)
- [Google Search Central Structured Data Guidelines](https://developers.google.com/search/docs/advanced/structured-data)
- [Google Rich Results Testing Tool](https://search.google.com/test/rich-results) 