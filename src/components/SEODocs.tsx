import React from 'react';

const SEODocs: React.FC = () => {
  return (
    <div className="bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">SEO Component Documentation</h1>
        
        <p className="text-lg mb-8">
          The CloudSeek SEO component provides comprehensive SEO and schema.org markup for different content types.
          This documentation explains how to use it effectively across your application.
        </p>
        
        <div className="prose prose-blue prose-lg max-w-none">
          <h2>Basic Usage</h2>
          <p>
            The SEO component should be placed at the top level of each page component. It uses react-helmet-async
            to manage meta tags.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md my-4 overflow-auto">
            <pre className="text-sm">
              {`import SEO from '../components/SEO';

const MyPage = () => {
  return (
    <>
      <SEO
        title="Page Title"
        description="Page description for SEO"
        canonical="/page-url"
        image="/images/page-image.jpg"
      />
      {/* Rest of your page */}
    </>
  );
};`}
            </pre>
          </div>
          
          <h2>Available Props</h2>
          <ul>
            <li><strong>title</strong>: Page title (will be appended with "| CloudSeek")</li>
            <li><strong>description</strong>: Meta description</li>
            <li><strong>canonical</strong>: Canonical URL path (e.g., "/about")</li>
            <li><strong>image</strong>: Image URL for social sharing</li>
            <li><strong>type</strong>: Content type ('website', 'article', 'service', or 'faq')</li>
            <li><strong>publishDate</strong>: ISO date string for publish date (articles)</li>
            <li><strong>modifiedDate</strong>: ISO date string for modified date (articles)</li>
            <li><strong>author</strong>: Content author name (articles)</li>
            <li><strong>twitterHandle</strong>: Twitter handle (default: '@cloudseek')</li>
            <li><strong>noIndex</strong>: Set to true to add noindex, nofollow directives</li>
            <li><strong>structuredData</strong>: Custom structured data object</li>
            <li><strong>faqItems</strong>: Array of FAQ items for FAQPage schema</li>
            <li><strong>serviceDetails</strong>: Service details for Service schema</li>
            <li><strong>blogPostDetails</strong>: Blog post details for BlogPosting schema</li>
          </ul>
          
          <h2>Schema.org Implementation</h2>
          <p>
            The SEO component automatically generates appropriate schema.org JSON-LD markup based on the
            content type. Here's how to use it for each type:
          </p>
          
          <h3>1. Organization Schema (Included by Default)</h3>
          <p>
            Organization schema is included on all pages automatically. It includes basic information
            about CloudSeek as a company.
          </p>
          
          <h3>2. WebPage Schema (Default Type)</h3>
          <p>
            Used for regular website pages. This is the default if no specific type is provided.
          </p>
          <div className="bg-gray-50 p-4 rounded-md my-4 overflow-auto">
            <pre className="text-sm">
              {`<SEO
  title="About CloudSeek"
  description="Learn about CloudSeek, a leading Salesforce implementation partner."
  canonical="/about"
  image="/images/about-hero.jpg"
  type="website"
/>`}
            </pre>
          </div>
          
          <h3>3. BlogPosting Schema</h3>
          <p>
            Used for blog posts and articles. Requires article-specific metadata.
          </p>
          <div className="bg-gray-50 p-4 rounded-md my-4 overflow-auto">
            <pre className="text-sm">
              {`// Define blog post details
const blogPostDetails = {
  title: "10 Best Practices for Salesforce Implementation",
  description: "Discover the 10 essential best practices for Salesforce implementation.",
  author: "Jane Smith",
  publishDate: "2025-03-15T08:00:00Z",
  modifiedDate: "2025-03-17T10:30:00Z",
  image: "/images/blog/salesforce-implementation.jpg",
  url: "/blog/salesforce-implementation-best-practices",
  categories: ["Implementation", "Best Practices"],
  tags: ["Salesforce", "CRM", "Implementation"]
};

// Use in SEO component
<SEO
  title="10 Best Practices for Salesforce Implementation"
  description="Discover the 10 essential best practices for Salesforce implementation."
  canonical="/blog/salesforce-implementation-best-practices"
  image="/images/blog/salesforce-implementation.jpg"
  type="article"
  publishDate="2025-03-15T08:00:00Z"
  modifiedDate="2025-03-17T10:30:00Z"
  author="Jane Smith"
  blogPostDetails={blogPostDetails}
/>`}
            </pre>
          </div>
          
          <h3>4. Service Schema</h3>
          <p>
            Used for service pages to describe CloudSeek's services.
          </p>
          <div className="bg-gray-50 p-4 rounded-md my-4 overflow-auto">
            <pre className="text-sm">
              {`// Define service details
const serviceDetails = {
  name: "Salesforce Implementation Services",
  description: "Enterprise-grade Salesforce implementation services.",
  provider: "CloudSeek",
  areaServed: "Global",
  serviceType: "Salesforce Implementation",
  image: "/images/services/implementation.jpg"
};

// Use in SEO component
<SEO
  title="Salesforce Implementation Services"
  description="Enterprise-grade Salesforce implementation services."
  canonical="/services/salesforce-implementation"
  image="/images/services/implementation-hero.jpg"
  type="service"
  serviceDetails={serviceDetails}
/>`}
            </pre>
          </div>
          
          <h3>5. FAQPage Schema</h3>
          <p>
            Used for FAQ pages to markup questions and answers for search engines.
          </p>
          <div className="bg-gray-50 p-4 rounded-md my-4 overflow-auto">
            <pre className="text-sm">
              {`// Define FAQ items
const faqItems = [
  {
    question: "What is CloudSeek?",
    answer: "CloudSeek is a leading Salesforce implementation partner..."
  },
  {
    question: "What Salesforce services does CloudSeek offer?",
    answer: "We provide a comprehensive range of Salesforce services..."
  }
  // Additional FAQ items
];

// Use in SEO component
<SEO
  title="Frequently Asked Questions"
  description="Find answers to common questions about our services."
  canonical="/faq"
  image="/images/faq-banner.jpg"
  type="faq"
  faqItems={faqItems}
/>`}
            </pre>
          </div>
          
          <h2>SEO Best Practices</h2>
          <ol>
            <li>Always provide unique, descriptive titles and descriptions for each page</li>
            <li>Keep titles under 60 characters and descriptions under 160 characters</li>
            <li>Use canonical URLs to avoid duplicate content issues</li>
            <li>Provide high-quality, correctly sized images for social sharing</li>
            <li>Include structured data appropriate for the page content</li>
            <li>Update the publishDate and modifiedDate for content changes</li>
          </ol>
          
          <h2>Testing Schema.org Markup</h2>
          <p>
            Use these tools to validate your schema.org implementation:
          </p>
          <ul>
            <li>
              <a 
                href="https://validator.schema.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Schema.org Validator
              </a>
            </li>
            <li>
              <a 
                href="https://search.google.com/test/rich-results" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                Google Rich Results Test
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SEODocs; 