import React from 'react';
import { Helmet } from 'react-helmet-async';

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceDetails {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  serviceType?: string;
  image?: string;
}

interface BlogPostDetails {
  title: string;
  description: string;
  author: string;
  publishDate: string;
  modifiedDate?: string;
  image: string;
  url: string;
  categories?: string[];
  tags?: string[];
  // Enhanced fields for Article schema
  authorDetails?: AuthorDetails;
}

interface AlternateLink {
  href: string;
  hrefLang: string;
}

// New interfaces for advanced structured data
interface AuthorDetails {
  name: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  sameAs?: string[]; // social media profiles
}

interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

interface VideoDetails {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl?: string;
  embedUrl?: string;
  duration?: string; // ISO 8601 format - PT1H30M (1 hour, 30 minutes)
}

interface ReviewDetails {
  name: string;
  reviewBody: string;
  ratingValue: number;
  author: AuthorDetails;
  datePublished: string;
  itemReviewed?: {
    name: string;
    type: string; // Product, Service, Organization, etc.
    image?: string;
  };
}

// Schema types
type SchemaObject = Record<string, unknown>;

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'service' | 'faq' | 'video' | 'review';
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
  twitterHandle?: string;
  structuredData?: SchemaObject;
  noIndex?: boolean;
  // Specific props for different page types
  faqItems?: FAQItem[];
  serviceDetails?: ServiceDetails;
  blogPostDetails?: BlogPostDetails;
  // New props for canonical and alternate URLs
  alternateLinks?: AlternateLink[];
  isAmp?: boolean;
  locale?: string;
  // New props for advanced structured data
  breadcrumbs?: BreadcrumbItem[];
  videoDetails?: VideoDetails;
  reviewDetails?: ReviewDetails;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  image,
  type = 'website',
  publishDate,
  modifiedDate,
  author,
  twitterHandle = '@cloudseek',
  structuredData,
  noIndex = false,
  faqItems,
  serviceDetails,
  blogPostDetails,
  alternateLinks = [],
  isAmp = false,
  locale = 'en-US',
  breadcrumbs,
  videoDetails,
  reviewDetails
}) => {
  const siteTitle = 'CloudSeek';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'Salesforce implementation experts helping businesses transform operations, enhance customer relationships, and drive growth.';
  const metaDescription = description || defaultDescription;
  const defaultImage = '/images/cloudseek-social-card.jpg';
  const metaImage = image || defaultImage;
  const siteUrl = 'https://cloudseek.io';
  
  /**
   * Normalize a URL path to ensure consistency
   */
  const normalizePath = (path: string): string => {
    if (!path) return '/';
    
    // Ensure path starts with a slash
    let normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Remove trailing slash except for the homepage
    if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
      normalizedPath = normalizedPath.slice(0, -1);
    }
    
    return normalizedPath;
  };
  
  /**
   * Generate the full URL from a path
   */
  const getFullUrl = (path: string): string => {
    const normalizedPath = normalizePath(path);
    return `${siteUrl}${normalizedPath}`;
  };
  
  // Determine the canonical URL
  // Safely access window object with a fallback for SSR
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const canonicalPath = canonical || pathname;
  const canonicalUrl = getFullUrl(canonicalPath);
  
  // Create default alternate links if none provided
  const defaultAlternateLinks: AlternateLink[] = [
    // Default language version - used as a fallback if no alternateLinks provided
    { href: canonicalUrl, hrefLang: locale }
  ];
  
  // If the site has a generic "x-default" version, add it
  if (!alternateLinks.some(link => link.hrefLang === 'x-default')) {
    defaultAlternateLinks.push({ 
      href: canonicalUrl, 
      hrefLang: 'x-default'
    });
  }
  
  // Use provided alternate links or defaults
  const allAlternateLinks = alternateLinks.length > 0 
    ? alternateLinks 
    : defaultAlternateLinks;

  /**
   * Generate Organization schema
   */
  const generateOrganizationSchema = (): SchemaObject => {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "CloudSeek",
      "url": "https://www.cloudseek.io",
      "logo": "https://www.cloudseek.io/logo.png",
      "description": "A leading Salesforce implementation partner specializing in digital transformation.",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-123-4567",
        "contactType": "customer service",
        "email": "info@cloudseek.io",
        "areaServed": ["US", "UAE", "Pakistan"],
        "availableLanguage": ["English", "Arabic"]
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Technology Drive",
        "addressLocality": "Raleigh",
        "addressRegion": "NC",
        "postalCode": "27601",
        "addressCountry": "US"
      },
      "sameAs": [
        "https://www.facebook.com/cloudseek",
        "https://www.twitter.com/cloudseek",
        "https://www.linkedin.com/company/cloudseek",
        "https://www.instagram.com/cloudseek"
      ]
    };
  };

  /**
   * Generate BreadcrumbList schema
   */
  const generateBreadcrumbListSchema = (): SchemaObject => {
    // Use provided breadcrumbs or create a default breadcrumb
    const breadcrumbItems = breadcrumbs || [
      {
        name: 'Home',
        url: siteUrl,
        position: 1
      },
      {
        name: title || 'Current Page',
        url: canonicalUrl,
        position: 2
      }
    ];

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems.map(crumb => ({
        "@type": "ListItem",
        "position": crumb.position,
        "name": crumb.name,
        "item": crumb.url.startsWith('http') ? crumb.url : getFullUrl(crumb.url)
      }))
    };
  };

  /**
   * Generate WebPage schema
   */
  const generateWebPageSchema = (): SchemaObject => {
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": fullTitle,
      "description": metaDescription,
      "url": canonicalUrl,
      "image": metaImage.startsWith('http') ? metaImage : `${siteUrl}${metaImage}`,
      "datePublished": publishDate || new Date().toISOString(),
      "dateModified": modifiedDate || new Date().toISOString(),
      "isPartOf": {
        "@type": "WebSite",
        "name": siteTitle,
        "url": siteUrl
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": metaImage.startsWith('http') ? metaImage : `${siteUrl}${metaImage}`
      },
      "breadcrumb": generateBreadcrumbListSchema(),
      "inLanguage": locale
    };
  };

  /**
   * Generate enhanced BlogPosting/Article schema
   */
  const generateBlogPostingSchema = (): SchemaObject | null => {
    if (!blogPostDetails && type === 'article') {
      // Fallback to props if blogPostDetails not provided
      const authorObject = {
        "@type": "Person",
        "name": author || "CloudSeek Team"
      };

      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title || "",
        "description": metaDescription,
        "image": metaImage.startsWith('http') ? metaImage : `${siteUrl}${metaImage}`,
        "datePublished": publishDate || new Date().toISOString(),
        "dateModified": modifiedDate || publishDate || new Date().toISOString(),
        "author": authorObject,
        "publisher": generateOrganizationSchema(),
        "url": canonicalUrl,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl
        },
        "inLanguage": locale,
        "articleBody": description || defaultDescription
      };
    }

    if (blogPostDetails) {
      // Create enhanced author object with more details if available
      const authorObject: SchemaObject = {
        "@type": "Person",
        "name": blogPostDetails.authorDetails?.name || blogPostDetails.author
      };

      // Add additional author details if available
      if (blogPostDetails.authorDetails) {
        if (blogPostDetails.authorDetails.url) {
          authorObject.url = blogPostDetails.authorDetails.url;
        }
        
        if (blogPostDetails.authorDetails.image) {
          authorObject.image = blogPostDetails.authorDetails.image;
        }
        
        if (blogPostDetails.authorDetails.jobTitle) {
          authorObject.jobTitle = blogPostDetails.authorDetails.jobTitle;
        }
        
        if (blogPostDetails.authorDetails.sameAs && blogPostDetails.authorDetails.sameAs.length > 0) {
          authorObject.sameAs = blogPostDetails.authorDetails.sameAs;
        }
      }

      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": blogPostDetails.title,
        "description": blogPostDetails.description,
        "image": blogPostDetails.image.startsWith('http') ? blogPostDetails.image : `${siteUrl}${blogPostDetails.image}`,
        "datePublished": blogPostDetails.publishDate,
        "dateModified": blogPostDetails.modifiedDate || blogPostDetails.publishDate,
        "author": authorObject,
        "publisher": generateOrganizationSchema(),
        "url": blogPostDetails.url.startsWith('http') ? blogPostDetails.url : `${siteUrl}${blogPostDetails.url}`,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": blogPostDetails.url.startsWith('http') ? blogPostDetails.url : `${siteUrl}${blogPostDetails.url}`
        },
        "keywords": blogPostDetails.tags ? blogPostDetails.tags.join(", ") : "",
        "articleSection": blogPostDetails.categories ? blogPostDetails.categories[0] : "Salesforce",
        "inLanguage": locale
      };
    }

    return null;
  };

  /**
   * Generate Service schema
   */
  const generateServiceSchema = (): SchemaObject | null => {
    if (!serviceDetails && type === 'service') {
      // Default service schema based on page props
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": title || "Salesforce Services",
        "description": metaDescription,
        "provider": generateOrganizationSchema(),
        "serviceType": "Salesforce Implementation",
        "areaServed": {
          "@type": "Country",
          "name": "United States"
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl,
          "validFrom": new Date().toISOString().split('T')[0]
        }
      };
    }

    if (serviceDetails) {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": serviceDetails.name,
        "description": serviceDetails.description,
        "provider": {
          "@type": "Organization",
          "name": serviceDetails.provider || "CloudSeek",
          "url": "https://cloudseek.io"
        },
        "serviceType": serviceDetails.serviceType || "Salesforce Implementation",
        "areaServed": serviceDetails.areaServed || {
          "@type": "Country",
          "name": "United States"
        },
        "image": serviceDetails.image ? `${siteUrl}${serviceDetails.image}` : metaImage.startsWith('http') ? metaImage : `${siteUrl}${metaImage}`,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl,
          "validFrom": new Date().toISOString().split('T')[0]
        }
      };
    }

    return null;
  };

  /**
   * Generate enhanced FAQ schema
   */
  const generateFAQSchema = (): SchemaObject | null => {
    if (!faqItems || faqItems.length === 0) {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
  };

  /**
   * Generate VideoObject schema
   */
  const generateVideoObjectSchema = (): SchemaObject | null => {
    if (!videoDetails && type !== 'video') {
      return null;
    }

    // Create default video details if type is video but no details provided
    if (!videoDetails && type === 'video') {
      return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": title || "Video",
        "description": metaDescription,
        "thumbnailUrl": metaImage.startsWith('http') ? metaImage : `${siteUrl}${metaImage}`,
        "uploadDate": publishDate || new Date().toISOString(),
        "publisher": {
          "@type": "Organization",
          "name": "CloudSeek",
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/logo.png`
          }
        }
      };
    }

    if (videoDetails) {
      return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": videoDetails.name,
        "description": videoDetails.description,
        "thumbnailUrl": videoDetails.thumbnailUrl.startsWith('http') 
          ? videoDetails.thumbnailUrl 
          : `${siteUrl}${videoDetails.thumbnailUrl}`,
        "uploadDate": videoDetails.uploadDate,
        "contentUrl": videoDetails.contentUrl || undefined,
        "embedUrl": videoDetails.embedUrl || undefined,
        "duration": videoDetails.duration || undefined,
        "publisher": {
          "@type": "Organization",
          "name": "CloudSeek",
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/logo.png`
          }
        }
      };
    }

    return null;
  };

  /**
   * Generate Review schema
   */
  const generateReviewSchema = (): SchemaObject | null => {
    if (!reviewDetails && type !== 'review') {
      return null;
    }

    // Create default review details if type is review but no details provided
    if (!reviewDetails && type === 'review') {
      return {
        "@context": "https://schema.org",
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": 5,
          "bestRating": 5
        },
        "name": title || "Customer Review",
        "reviewBody": description || "Great service and support.",
        "author": {
          "@type": "Person",
          "name": author || "Happy Customer"
        },
        "datePublished": publishDate || new Date().toISOString(),
        "publisher": generateOrganizationSchema(),
        "itemReviewed": {
          "@type": "Service",
          "name": "Salesforce Implementation",
          "image": metaImage.startsWith('http') ? metaImage : `${siteUrl}${metaImage}`
        }
      };
    }

    if (reviewDetails) {
      // Create author object
      const authorObject: SchemaObject = {
        "@type": "Person",
        "name": reviewDetails.author.name
      };

      // Add additional author details if available
      if (reviewDetails.author.url) {
        authorObject.url = reviewDetails.author.url;
      }
      
      if (reviewDetails.author.image) {
        authorObject.image = reviewDetails.author.image;
      }
      
      if (reviewDetails.author.jobTitle) {
        authorObject.jobTitle = reviewDetails.author.jobTitle;
      }
      
      if (reviewDetails.author.sameAs && reviewDetails.author.sameAs.length > 0) {
        authorObject.sameAs = reviewDetails.author.sameAs;
      }

      // Create item reviewed object
      const itemReviewedObject: SchemaObject = {
        "@type": reviewDetails.itemReviewed?.type || "Product",
        "name": reviewDetails.itemReviewed?.name || "CloudSeek Services"
      };

      if (reviewDetails.itemReviewed?.image) {
        itemReviewedObject.image = reviewDetails.itemReviewed.image;
      }

      return {
        "@context": "https://schema.org",
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": reviewDetails.ratingValue,
          "bestRating": 5
        },
        "name": reviewDetails.name,
        "reviewBody": reviewDetails.reviewBody,
        "author": authorObject,
        "datePublished": reviewDetails.datePublished,
        "publisher": generateOrganizationSchema(),
        "itemReviewed": itemReviewedObject
      };
    }

    return null;
  };

  /**
   * Get appropriate schema based on page type
   */
  const getSchemaMarkup = (): SchemaObject | SchemaObject[] => {
    // If custom schema is provided, use it
    if (structuredData) {
      return structuredData;
    }

    // Organization schema is always included
    const schemas: SchemaObject[] = [generateOrganizationSchema()];
    
    // Always include breadcrumb schema
    schemas.push(generateBreadcrumbListSchema());

    // Add specific schema based on page type
    switch (type) {
      case 'article': {
        const blogSchema = generateBlogPostingSchema();
        if (blogSchema) schemas.push(blogSchema);
        break;
      }
      case 'service': {
        const serviceSchema = generateServiceSchema();
        if (serviceSchema) schemas.push(serviceSchema);
        break;
      }
      case 'faq': {
        const faqSchema = generateFAQSchema();
        if (faqSchema) schemas.push(faqSchema);
        break;
      }
      case 'video': {
        const videoSchema = generateVideoObjectSchema();
        if (videoSchema) schemas.push(videoSchema);
        break;
      }
      case 'review': {
        const reviewSchema = generateReviewSchema();
        if (reviewSchema) schemas.push(reviewSchema);
        break;
      }
      default:
        // Default to WebPage schema for all other types
        schemas.push(generateWebPageSchema());
    }

    // Add FAQ schema if FAQ items are provided, regardless of page type
    if (faqItems && faqItems.length > 0 && type !== 'faq') {
      const faqSchema = generateFAQSchema();
      if (faqSchema) schemas.push(faqSchema);
    }
    
    // Add video schema if video details are provided, regardless of page type
    if (videoDetails && type !== 'video') {
      const videoSchema = generateVideoObjectSchema();
      if (videoSchema) schemas.push(videoSchema);
    }
    
    // Add review schema if review details are provided, regardless of page type
    if (reviewDetails && type !== 'review') {
      const reviewSchema = generateReviewSchema();
      if (reviewSchema) schemas.push(reviewSchema);
    }

    return schemas.length === 1 ? schemas[0] : schemas;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta httpEquiv="content-language" content={locale} />
      
      {/* Canonical URL - always include this */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Alternate language versions */}
      {allAlternateLinks.map((link, index) => (
        <link 
          key={`alternate-${index}`}
          rel="alternate" 
          href={link.href} 
          hrefLang={link.hrefLang}
        />
      ))}
      
      {/* AMP version link if available */}
      {isAmp && <link rel="amphtml" href={`${canonicalUrl}/amp`} />}
      
      {/* If this is an AMP page, link back to regular HTML version */}
      {typeof window !== 'undefined' && window.location.pathname.endsWith('/amp') && (
        <link rel="canonical" href={canonicalUrl.replace(/\/amp$/, '')} />
      )}
      
      {/* No index directive if specified */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* OpenGraph Tags */}
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type === 'article' ? 'article' : 'website'} />
      <meta property="og:image" content={metaImage.startsWith('http') ? metaImage : `${siteUrl}${metaImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={locale} />
      
      {/* Article Meta (for blog posts) */}
      {type === 'article' && publishDate && (
        <meta property="article:published_time" content={publishDate} />
      )}
      {type === 'article' && modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage.startsWith('http') ? metaImage : `${siteUrl}${metaImage}`} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(getSchemaMarkup())}
      </script>
    </Helmet>
  );
};

export default SEO; 