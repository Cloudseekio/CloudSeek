import { BlogPost, BlogCategory, BlogTag, Author } from '../models/Blog';

// Mock categories
const mockCategories: BlogCategory[] = [
  {
    id: 'implementation',
    name: 'Implementation',
    slug: 'implementation',
    description: 'Articles about implementing software solutions'
  },
  {
    id: 'development',
    name: 'Development',
    slug: 'development',
    description: 'Articles about software development techniques and best practices'
  }
];

// Mock tags
const mockTags: BlogTag[] = [
  { id: 'salesforce', name: 'Salesforce', slug: 'salesforce' },
  { id: 'crm', name: 'CRM', slug: 'crm' },
  { id: 'getting-started', name: 'Getting Started', slug: 'getting-started' },
  { id: 'react', name: 'React', slug: 'react' },
  { id: 'frontend', name: 'Frontend', slug: 'frontend' },
  { id: 'javascript', name: 'JavaScript', slug: 'javascript' },
  { id: 'nextjs', name: 'Next.js', slug: 'nextjs' },
  { id: 'api', name: 'API', slug: 'api' },
  { id: 'backend', name: 'Backend', slug: 'backend' }
];

// Mock authors
const mockAuthors: Author[] = [
  {
    id: 'sarah-johnson',
    name: 'Sarah Johnson',
    avatar: '/images/avatars/sarah-johnson.jpg'
  },
  {
    id: 'michael-chen',
    name: 'Michael Chen',
    avatar: '/images/avatars/michael-chen.jpg'
  }
];

// Clean up the data by removing unknown properties
// (only keep properties that exist in the BlogPost type)
const cleanBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Salesforce Implementation',
    slug: 'getting-started-with-salesforce-implementation',
    excerpt: 'A comprehensive guide to starting your Salesforce implementation journey with best practices and key considerations.',
    content: `
# Getting Started with Salesforce Implementation

Implementing Salesforce successfully requires careful planning and a structured approach. This guide covers the essential steps to ensure your implementation delivers maximum value.

## Planning Your Implementation

Before diving into the technical aspects, it's crucial to define your business requirements and objectives. Start by asking:

- What business problems are you trying to solve?
- Which departments will be using Salesforce?
- What are your key metrics for success?

Creating a clear implementation roadmap will help you stay on track and measure progress effectively.

## Choosing the Right Edition

Salesforce offers several editions, each with different capabilities and pricing:

- **Essentials**: For small businesses needing basic CRM functionality
- **Professional**: For growing businesses requiring more customization
- **Enterprise**: For larger organizations with complex processes
- **Unlimited**: For organizations needing maximum customization and support

Selecting the appropriate edition depends on your current needs and future growth plans.

## Data Migration Strategy

Data migration is often one of the most challenging aspects of a Salesforce implementation. Consider these best practices:

1. Clean your data before migration
2. Create a detailed mapping document
3. Test with a subset of data before full migration
4. Validate data post-migration

A phased approach to data migration often yields the best results, allowing for adjustments along the way.

## User Adoption Planning

Even the best implementation will fail without strong user adoption. Develop a comprehensive adoption strategy that includes:

- Executive sponsorship
- Tailored training programs
- Champions within each department
- Clear communication about benefits
- Feedback mechanisms for continuous improvement

Remember that adoption is an ongoing process, not a one-time event.
    `,
    publishedAt: '2023-05-15T08:00:00Z',
    updatedAt: '2023-06-10T10:30:00Z',
    authors: [mockAuthors[0]],
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[1], mockTags[2]],
    coverImage: {
      url: '/images/blog/salesforce-implementation.jpg',
      alt: 'Salesforce Implementation'
    },
    readingTime: 8,
    featured: true
  },
  {
    id: 'react-2024',
    title: 'The Future of React Development in 2024',
    slug: 'future-of-react-2024',
    excerpt: 'Explore the latest trends and best practices in React development, including Server Components, Suspense, and the new React compiler.',
    content: `
# The Future of React Development in 2024

React continues to evolve rapidly in 2024, with exciting new features and patterns that improve both developer experience and application performance. This article explores the most important developments in the React ecosystem.

## Server Components: A New Paradigm

React Server Components represent one of the most significant shifts in how we build React applications. By allowing components to run exclusively on the server, they:

- Reduce bundle size by keeping server-only code out of the client bundle
- Enable direct access to backend resources without API layers
- Improve performance for data-heavy applications

## The React Compiler (formerly React Forget)

The new React compiler automatically optimizes your components for better performance by:

- Generating memoization code automatically
- Reducing unnecessary re-renders
- Maintaining component readability while improving runtime performance

## Enhanced Suspense for Data Fetching

Suspense has matured into a powerful tool for handling async operations with improvements in:

- Streaming server rendering
- Nested suspense boundaries
- Integration with server components

## Best Practices for Modern React

To make the most of these new capabilities, developers should consider:

1. Organizing code with a clear server/client separation
2. Leveraging React's built-in optimizations before reaching for external libraries
3. Embracing the React ecosystem tools like React Query and Zustand that work well with new React features
    `,
    publishedAt: '2024-03-15T08:00:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
    authors: [mockAuthors[0]],
    category: mockCategories[1],
    tags: [mockTags[3], mockTags[4], mockTags[5]],
    coverImage: {
      url: '/images/blog/react-2024.jpg',
      alt: 'React Development in 2024'
    },
    readingTime: 10,
    featured: true
  },
  {
    id: 'nextjs-apis',
    title: 'Building Scalable APIs with Next.js',
    slug: 'scalable-apis-nextjs',
    excerpt: 'Learn how to create robust and scalable API routes using Next.js, including authentication, rate limiting, and error handling.',
    content: `
# Building Scalable APIs with Next.js

Next.js provides a powerful framework for creating API endpoints directly within your application. This article explores best practices for building production-ready APIs with Next.js.

## Setting Up API Routes

Next.js makes it easy to create API endpoints through the pages/api directory structure. We'll explore:

- Basic route setup and organization
- Handling different HTTP methods
- Request validation techniques

## Authentication and Authorization

Security is critical for any API. Learn how to implement:

- JWT-based authentication
- Role-based access control
- OAuth integration options

## Rate Limiting and Protection

Protect your API from abuse with:

- Request rate limiting strategies
- IP-based restrictions
- Captcha integration for public endpoints

## Error Handling and Logging

Create a robust error handling system with:

- Consistent error response formats
- Centralized error logging
- Debugging tools and techniques
    `,
    publishedAt: '2024-03-12T09:00:00Z',
    updatedAt: '2024-03-13T14:30:00Z',
    authors: [mockAuthors[1]],
    category: mockCategories[1],
    tags: [mockTags[6], mockTags[7], mockTags[8]],
    coverImage: {
      url: '/images/blog/nextjs-api.jpg',
      alt: 'Next.js API Routes'
    },
    readingTime: 12,
    featured: true
  }
];

// Export the mock posts
const mockPosts = cleanBlogPosts;

// Extract unique tags from posts
const extractTags = (posts: BlogPost[]): string[] => {
  const tagsSet = new Set<string>();
  posts.forEach(post => {
    post.tags.forEach(tag => tagsSet.add(tag.name));
  });
  return Array.from(tagsSet);
};

// Service methods for fetching blog data
export const blogService = {
  // Function to get all posts
  getPosts: async (): Promise<BlogPost[]> => {
    // In a real implementation, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockPosts);
      }, 300);
    });
  },

  // Function to fetch a single post by slug
  getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    // In a real implementation, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Log the slugs to help with debugging
        console.log('Available slugs:', mockPosts.map(post => post.slug));
        console.log('Looking for slug:', slug);
        
        const post = mockPosts.find(post => post.slug === slug);
        resolve(post || null);
      }, 300);
    });
  },

  // Function to fetch all categories
  getCategories: async (): Promise<BlogCategory[]> => {
    // In a real implementation, this would be an API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockCategories);
      }, 300);
    });
  },

  // Function to fetch all tags
  getTags: async (): Promise<string[]> => {
    // In a real implementation, this would be an API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(extractTags(mockPosts));
      }, 300);
    });
  },

  // Function to search posts
  searchPosts: async (query: string): Promise<BlogPost[]> => {
    // In a real implementation, this would be an API call
    return new Promise(resolve => {
      setTimeout(() => {
        const filteredPosts = mockPosts.filter(post => 
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filteredPosts);
      }, 300);
    });
  },

  // Function to get posts by category
  getPostsByCategory: async (category: string): Promise<BlogPost[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredPosts = !category 
          ? mockPosts 
          : mockPosts.filter(post => 
              post.category?.slug.toLowerCase() === category.toLowerCase()
            );
        resolve(filteredPosts);
      }, 300);
    });
  },

  // Function to get posts by tag
  getPostsByTag: async (tag: string): Promise<BlogPost[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredPosts = !tag 
          ? mockPosts 
          : mockPosts.filter(post => 
              post.tags.some(t => t.slug.toLowerCase() === tag.toLowerCase())
            );
        resolve(filteredPosts);
      }, 300);
    });
  },

  // Function to get featured posts
  getFeaturedPosts: async (): Promise<BlogPost[]> => {
    // In a real implementation, this would be an API call
    return new Promise(resolve => {
      setTimeout(() => {
        const featuredPosts = mockPosts.filter(post => post.featured);
        resolve(featuredPosts);
      }, 300);
    });
  },

  // Function to get related posts
  getRelatedPosts: async (post: BlogPost, limit: number = 3): Promise<BlogPost[]> => {
    // In a real implementation, this would be an API call
    return new Promise(resolve => {
      setTimeout(() => {
        // Find posts with same category or tags
        const related = mockPosts
          .filter(p => p.id !== post.id) // Exclude current post
          .filter(p => 
            p.category === post.category || 
            p.tags.some(tag => post.tags.includes(tag))
          )
          .slice(0, limit);
        resolve(related);
      }, 300);
    });
  }
}; 