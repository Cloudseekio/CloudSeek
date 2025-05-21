import { BlogPost, BlogCategory, BlogTag, Author } from '../../models/Blog';

export const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Jane Smith',
    title: 'Salesforce Developer',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Jane is a certified Salesforce developer with over 8 years of experience building custom solutions for enterprise clients. She specializes in Lightning Web Components and integration solutions.',
    socialLinks: {
      twitter: 'https://twitter.com/janesmith',
      linkedin: 'https://linkedin.com/in/janesmith',
      website: 'https://janesmith.dev'
    }
  },
  {
    id: '2',
    name: 'Sarah Williams',
    title: 'Analytics Consultant',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Sarah helps organizations implement and leverage Salesforce Einstein Analytics to drive business insights and make data-driven decisions.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahwilliams',
      github: 'https://github.com/sarahwilliams'
    }
  },
  {
    id: '3',
    name: 'Michael Johnson',
    title: 'Salesforce Administrator',
    avatar: 'https://i.pravatar.cc/150?img=8',
    bio: 'Michael is a Salesforce administrator with expertise in optimizing Salesforce implementations for sales teams and improving workflow efficiency.'
  }
];

export const mockCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Development',
    slug: 'development',
    count: 12,
    description: 'Articles about Salesforce development, coding, and technical implementation details.'
  },
  {
    id: '2',
    name: 'Admin',
    slug: 'admin',
    count: 18,
    description: 'Tips and best practices for Salesforce administrators.'
  },
  {
    id: '3',
    name: 'Analytics',
    slug: 'analytics',
    count: 7,
    description: 'Articles about Salesforce Einstein Analytics, reporting, and data visualization.'
  },
  {
    id: '4',
    name: 'Integration',
    slug: 'integration',
    count: 5,
    description: 'Guidance on integrating Salesforce with other systems and platforms.'
  }
];

export const mockTags: BlogTag[] = [
  { id: '1', name: 'Salesforce', slug: 'salesforce', count: 30 },
  { id: '2', name: 'Apex', slug: 'apex', count: 15 },
  { id: '3', name: 'Lightning', slug: 'lightning', count: 18 },
  { id: '4', name: 'Einstein', slug: 'einstein', count: 10 },
  { id: '5', name: 'Integration', slug: 'integration', count: 8 },
  { id: '6', name: 'Admin', slug: 'admin', count: 20 },
  { id: '7', name: 'Development', slug: 'development', count: 25 },
  { id: '8', name: 'Productivity', slug: 'productivity', count: 7 },
  { id: '9', name: 'Analytics', slug: 'analytics', count: 12 },
  { id: '10', name: 'AI', slug: 'ai', count: 5 }
];

export const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with Salesforce Development',
    slug: 'getting-started-with-salesforce-development',
    authors: [mockAuthors[0]],
    category: 'Development',
    tags: ['Salesforce', 'Development', 'Apex', 'Lightning'],
    publishDate: '2023-06-15T08:00:00Z',
    readTime: 7,
    excerpt: 'Learn the fundamentals of developing on the Salesforce platform with this beginner\'s guide to Apex, Lightning Web Components, and more.',
    content: `
# Getting Started with Salesforce Development

## Introduction

Salesforce development offers a unique and powerful environment for building enterprise applications. Whether you're coming from another development platform or starting your coding journey with Salesforce, this guide will help you understand the basics and get started on the right foot.

## Understanding the Salesforce Platform

Salesforce provides several development tools and languages:

- **Apex**: A strongly-typed, object-oriented programming language that allows developers to execute flow and transaction control statements on the Salesforce platform.
- **Lightning Web Components (LWC)**: A modern framework for building single-page applications with reusable UI components.
- **Visualforce**: A markup language that lets you create custom pages and applications with a look and feel similar to Salesforce.
- **SOQL and SOSL**: Specialized query languages for searching your organization's Salesforce data.

## Setting Up Your Development Environment

Before you start coding, you'll need to set up your development environment:

1. **Create a Developer Edition Org**: This free version of Salesforce gives you a personal environment to develop and test.
2. **Install Salesforce Extensions for VS Code**: The recommended IDE for Salesforce development.
3. **Install Salesforce CLI**: A powerful command-line interface for development and automation.

## Your First Apex Class

Here's a simple Apex class to get you started:

\`\`\`apex
public class HelloWorld {
    public static void sayHello() {
        System.debug('Hello, Salesforce Developer!');
    }
    
    public static Integer addNumbers(Integer a, Integer b) {
        return a + b;
    }
}
\`\`\`

## Creating Your First Lightning Web Component

Create a basic LWC with these files:

*helloWorld.html*
\`\`\`html
<template>
    <div class="slds-box">
        <h1 class="slds-text-heading_medium">Hello, {greeting}!</h1>
        <lightning-button label="Change Greeting" onclick={changeGreeting}></lightning-button>
    </div>
</template>
\`\`\`

*helloWorld.js*
\`\`\`javascript
import { LightningElement, track } from 'lwc';

export default class HelloWorld extends LightningElement {
    @track greeting = 'World';
    
    changeGreeting() {
        this.greeting = 'Salesforce Developer';
    }
}
\`\`\`

## Next Steps

As you continue your Salesforce development journey, explore these areas:

1. Salesforce data model and relationship design
2. Apex triggers and best practices
3. Advanced Lightning Web Components
4. Integration patterns with external systems
5. Testing and deployment strategies

Happy coding!
`,
    contentFormat: 'markdown',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&h=500',
      alt: 'Books and coding',
      caption: 'Getting started with Salesforce development requires learning the platform fundamentals.'
    },
    featured: true,
    status: 'published',
    seo: {
      title: 'Getting Started with Salesforce Development: A Complete Beginner\'s Guide',
      description: 'Learn the fundamentals of Salesforce development including Apex, Lightning Components, and best practices for building on the platform.',
      keywords: ['salesforce development', 'apex', 'lightning web components', 'lwc', 'salesforce beginner']
    }
  },
  {
    id: '2',
    title: 'Understanding Salesforce Einstein Analytics',
    slug: 'understanding-salesforce-einstein-analytics',
    authors: [mockAuthors[1]],
    category: 'Analytics',
    tags: ['Salesforce', 'Einstein', 'Analytics', 'AI'],
    publishDate: '2023-04-18T10:30:00Z',
    readTime: 9,
    excerpt: 'A comprehensive guide to implementing and leveraging Salesforce Einstein Analytics in your organization.',
    content: `
# Understanding Salesforce Einstein Analytics

Einstein Analytics (now known as Tableau CRM) is Salesforce's powerful analytics platform that allows organizations to explore data, gain insights, and make data-driven decisions.

This article covers the key concepts, implementation strategies, and best practices for getting the most out of Einstein Analytics.

## Key Features

- Advanced data visualization
- AI-powered insights with Einstein Discovery
- Prebuilt dashboards and apps
- Custom analytics applications
- Mobile-first design

## Implementation Steps

1. Define your analytics strategy
2. Prepare your data model
3. Create datasets and dataflows
4. Build dashboards and lenses
5. Set up security and sharing
6. Train users and gather feedback

## Best Practices

- Start with clear business questions
- Keep dashboards focused on specific use cases
- Optimize query performance
- Use consistent formatting
- Implement proper data governance
`,
    contentFormat: 'markdown',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=500',
      alt: 'Data analytics visualization',
      caption: 'Einstein Analytics helps organizations visualize and understand their data.'
    },
    featured: true,
    status: 'published',
    seo: {
      title: 'Understanding Salesforce Einstein Analytics: Implementation Guide',
      description: 'Learn how to implement and leverage Salesforce Einstein Analytics to derive powerful insights from your business data.'
    }
  },
  {
    id: '3',
    title: '10 Tips for Salesforce Admins to Boost Productivity',
    slug: '10-tips-for-salesforce-admins-to-boost-productivity',
    authors: [mockAuthors[2]],
    category: 'Admin',
    tags: ['Salesforce', 'Admin', 'Productivity', 'Tips'],
    publishDate: '2023-05-07T14:15:00Z',
    readTime: 5,
    excerpt: 'Discover powerful tricks and best practices to make your Salesforce administration more efficient and effective.',
    content: `
# 10 Tips for Salesforce Admins to Boost Productivity

As a Salesforce administrator, optimizing your workflow can save countless hours and help your organization get more value from the platform. Here are 10 tips to supercharge your Salesforce admin productivity.

## 1. Master List Views

Create comprehensive list views for quick access to relevant records. Use filters, custom fields, and color coding to make information easy to scan.

## 2. Embrace Validation Rules

Prevent data quality issues before they happen with strategic validation rules. Just be careful not to create too many, which can frustrate users.

## 3. Automate with Flow Builder

Flow Builder is your best friend for automation without code. Learn to build screen flows, autolaunched flows, and scheduled flows to eliminate repetitive tasks.

## 4. Use Quick Actions

Configure quick actions on record pages to streamline common tasks for your users, reducing clicks and saving time.

## 5. Create Custom Report Types

Build custom report types that combine objects in meaningful ways for your business reporting needs.

## 6. Organize with Apps and Tabs

Structure your Salesforce instance with thoughtful app and tab organization to help users quickly find what they need.

## 7. Implement In-App Guidance

Use prompts and walkthroughs to train users directly within Salesforce, reducing support requests.

## 8. Regular Maintenance

Schedule time for regular "health checks" of your org to optimize performance, remove unused fields, and keep everything running smoothly.

## 9. Document Everything

Maintain thorough documentation of your customizations, configurations, and processes - your future self will thank you.

## 10. Join the Trailblazer Community

Connect with other admins to share solutions, get inspiration, and stay updated on best practices.
`,
    contentFormat: 'markdown',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&h=500',
      alt: 'Productivity desk setup',
      caption: 'The right strategies and tools can dramatically increase Salesforce administrator efficiency.'
    },
    featured: false,
    status: 'published',
    seo: {
      title: '10 Essential Tips for Salesforce Admins to Boost Productivity',
      description: 'Learn practical strategies and techniques to make your Salesforce administration more efficient and effective with these 10 pro tips.'
    }
  }
];

export const mockBlogData = {
  posts: mockPosts,
  categories: mockCategories,
  tags: mockTags,
  authors: mockAuthors
}; 