import React from 'react';
import SEO from './SEO';

/**
 * This file provides examples of how to use the enhanced SEO component
 * for different content types with schema.org JSON-LD markup
 */

/**
 * Example components demonstrating how to use the enhanced SEO component
 * with different schema types
 */

// Example for a regular page (WebPage schema)
export const RegularPageSEO: React.FC = () => {
  return (
    <SEO
      title="About Our Company"
      description="Learn more about CloudSeek and our mission to transform businesses through technology."
      image="/images/about-header.jpg"
      // Adding breadcrumb navigation
      breadcrumbs={[
        { name: 'Home', url: '/', position: 1 },
        { name: 'About', url: '/about', position: 2 }
      ]}
    />
  );
};

// Example for a blog post (BlogPosting schema)
export const BlogPostSEO: React.FC = () => {
  return (
    <SEO
      type="article"
      title="10 Ways to Improve Your Salesforce Implementation"
      description="Discover top strategies to enhance your Salesforce implementation and maximize ROI."
      image="/images/blog/salesforce-implementation.jpg"
      publishDate="2023-06-15T08:00:00Z"
      modifiedDate="2023-06-20T10:30:00Z"
      blogPostDetails={{
        title: "10 Ways to Improve Your Salesforce Implementation",
        description: "Discover top strategies to enhance your Salesforce implementation and maximize ROI.",
        author: "Jane Smith",
        publishDate: "2023-06-15T08:00:00Z",
        modifiedDate: "2023-06-20T10:30:00Z",
        image: "/images/blog/salesforce-implementation.jpg",
        url: "/blog/improve-salesforce-implementation",
        categories: ["Salesforce", "Implementation", "Best Practices"],
        tags: ["Salesforce", "CRM", "Implementation", "ROI", "Digital Transformation"],
        // Enhanced author information
        authorDetails: {
          name: "Jane Smith",
          url: "https://cloudseek.io/team/jane-smith",
          image: "/images/team/jane-smith.jpg",
          jobTitle: "Senior Salesforce Consultant",
          sameAs: [
            "https://www.linkedin.com/in/jane-smith",
            "https://twitter.com/janesmith"
          ]
        }
      }}
      // Adding breadcrumb navigation
      breadcrumbs={[
        { name: 'Home', url: '/', position: 1 },
        { name: 'Blog', url: '/blog', position: 2 },
        { name: '10 Ways to Improve Your Salesforce Implementation', url: '/blog/improve-salesforce-implementation', position: 3 }
      ]}
    />
  );
};

// Example for a service page (Service schema)
export const ServicePageSEO: React.FC = () => {
  return (
    <SEO
      type="service"
      title="Salesforce Implementation Services"
      description="Expert Salesforce implementation services tailored to your business needs."
      image="/images/services/salesforce-implementation.jpg"
      serviceDetails={{
        name: "Salesforce Implementation Services",
        description: "Expert Salesforce implementation services tailored to your business needs.",
        provider: "CloudSeek",
        serviceType: "Salesforce Implementation",
        areaServed: "United States, UAE, Canada",
        image: "/images/services/salesforce-implementation.jpg"
      }}
      // Adding breadcrumb navigation
      breadcrumbs={[
        { name: 'Home', url: '/', position: 1 },
        { name: 'Services', url: '/services', position: 2 },
        { name: 'Salesforce Implementation', url: '/services/salesforce-implementation', position: 3 }
      ]}
    />
  );
};

// Example for a FAQ page (FAQPage schema)
export const FAQPageSEO: React.FC = () => {
  return (
    <SEO
      type="faq"
      title="Frequently Asked Questions"
      description="Answers to common questions about our Salesforce implementation services."
      faqItems={[
        {
          question: "How long does a typical Salesforce implementation take?",
          answer: "A typical implementation takes 2-4 months depending on complexity and requirements."
        },
        {
          question: "Do you offer ongoing support after implementation?",
          answer: "Yes, we offer various support packages to ensure your Salesforce instance runs smoothly."
        },
        {
          question: "What industries do you specialize in?",
          answer: "We specialize in Financial Services, Healthcare, Manufacturing, and Retail industries."
        }
      ]}
      // Adding breadcrumb navigation
      breadcrumbs={[
        { name: 'Home', url: '/', position: 1 },
        { name: 'FAQ', url: '/faq', position: 2 }
      ]}
    />
  );
};

export const VideoPageSEO: React.FC = () => {
  return (
    <SEO
      type="video"
      title="Salesforce Lightning Experience Overview"
      description="Watch our video overview of the Salesforce Lightning Experience and its benefits."
      videoDetails={{
        name: "Salesforce Lightning Experience Overview",
        description: "Comprehensive guide to understanding the Salesforce Lightning Experience interface and its key benefits for your business.",
        thumbnailUrl: "/images/videos/lightning-overview-thumb.jpg",
        uploadDate: "2023-07-10T14:00:00Z",
        embedUrl: "https://www.youtube.com/embed/12345abcde",
        duration: "PT8M30S" // 8 minutes 30 seconds in ISO 8601 format
      }}
      // Adding breadcrumb navigation
      breadcrumbs={[
        { name: 'Home', url: '/', position: 1 },
        { name: 'Resources', url: '/resources', position: 2 },
        { name: 'Videos', url: '/resources/videos', position: 3 },
        { name: 'Salesforce Lightning Experience Overview', url: '/resources/videos/lightning-experience-overview', position: 4 }
      ]}
    />
  );
};

export const TestimonialPageSEO: React.FC = () => {
  return (
    <SEO
      type="review"
      title="Client Testimonials"
      description="See what our clients are saying about our Salesforce implementation services."
      reviewDetails={{
        name: "Excellent Salesforce Implementation Partner",
        reviewBody: "CloudSeek provided outstanding Salesforce implementation services. Their team was knowledgeable, responsive, and delivered the project on time and within budget.",
        ratingValue: 5,
        datePublished: "2023-05-20T09:00:00Z",
        author: {
          name: "John Anderson",
          jobTitle: "CIO",
          url: "https://www.globalfinanceinc.com/leadership/john-anderson",
          image: "/images/testimonials/john-anderson.jpg"
        },
        itemReviewed: {
          name: "CloudSeek Salesforce Implementation Services",
          type: "Service",
          image: "/images/services/salesforce-implementation.jpg"
        }
      }}
      // Adding breadcrumb navigation
      breadcrumbs={[
        { name: 'Home', url: '/', position: 1 },
        { name: 'Testimonials', url: '/testimonials', position: 2 }
      ]}
    />
  );
};

// Example of a page with multiple schema types
export const CombinedSchemasSEO: React.FC = () => {
  return (
    <SEO
      title="Salesforce Implementation Case Study: Global Financial Corp"
      description="Learn how we helped Global Financial Corp implement Salesforce to increase efficiency by 35%."
      image="/images/case-studies/global-financial-cover.jpg"
      // Add article schema
      type="article"
      publishDate="2023-04-12T10:00:00Z"
      blogPostDetails={{
        title: "Salesforce Implementation Case Study: Global Financial Corp",
        description: "Learn how we helped Global Financial Corp implement Salesforce to increase efficiency by 35%.",
        author: "CloudSeek Team",
        publishDate: "2023-04-12T10:00:00Z",
        image: "/images/case-studies/global-financial-cover.jpg",
        url: "/case-studies/global-financial-corp",
        categories: ["Case Study", "Financial Services"],
        authorDetails: {
          name: "Alex Johnson",
          jobTitle: "Solutions Architect",
          image: "/images/team/alex-johnson.jpg"
        }
      }}
      // Add video schema
      videoDetails={{
        name: "Global Financial Corp Salesforce Implementation Overview",
        description: "See how CloudSeek implemented Salesforce for Global Financial Corp in this project overview video.",
        thumbnailUrl: "/images/case-studies/global-financial-video.jpg",
        uploadDate: "2023-04-15T14:00:00Z",
        embedUrl: "https://www.youtube.com/embed/abcde12345",
        duration: "PT5M20S"
      }}
      // Add testimonial/review schema
      reviewDetails={{
        name: "Global Financial Corp Review",
        reviewBody: "CloudSeek transformed our operations with their expert Salesforce implementation. Highly recommended!",
        ratingValue: 5,
        datePublished: "2023-04-20T09:00:00Z",
        author: {
          name: "Sarah Williams",
          jobTitle: "Director of Operations, Global Financial Corp",
          url: "https://www.linkedin.com/in/sarah-williams-gfc"
        },
        itemReviewed: {
          name: "CloudSeek Salesforce Implementation Services",
          type: "Service"
        }
      }}
      // Add FAQs
      faqItems={[
        {
          question: "What challenges did Global Financial Corp face before implementing Salesforce?",
          answer: "They faced challenges with data silos, manual processes, and lack of visibility into customer interactions."
        },
        {
          question: "What specific Salesforce products were implemented?",
          answer: "Sales Cloud, Service Cloud, and Einstein Analytics were implemented in a phased approach."
        }
      ]}
      // Adding breadcrumb navigation
      breadcrumbs={[
        { name: 'Home', url: '/', position: 1 },
        { name: 'Case Studies', url: '/case-studies', position: 2 },
        { name: 'Global Financial Corp', url: '/case-studies/global-financial-corp', position: 3 }
      ]}
    />
  );
};

export default CombinedSchemasSEO;

/**
 * Usage in components:
 * 
 * import { BlogPostSEO } from '../components/SEOExample';
 * 
 * const BlogPostPage = () => {
 *   return (
 *     <>
 *       <BlogPostSEO />
 *       <main>
 *         {/* Blog post content */}
 *       </main>
 *     </>
 *   );
 * };
 */ 