/**
 * Blog System Data Model Test
 * 
 * This file tests the unified data model to ensure consistency between
 * mock data and Contentful data sources.
 */

import { getContentfulService } from '../services/serviceFactory';
import MockBlogService from '../services/mockBlogService';
import { BlogPost, ContentFormat } from '../types/blog';

// Initialize services
const mockService = new MockBlogService();
// Use the factory method to get ContentfulService
const contentfulService = getContentfulService();

/**
 * Adapts a legacy BlogPost from models/Blog to the standardized format in blog/types/blog
 * 
 * Using 'any' type here is necessary due to the structural differences between
 * the legacy BlogPost from models/Blog and the standardized BlogPost from blog/types/blog.
 * In a real-world scenario, we would define a proper adapter or migration utility.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptMockPostToStandardFormat(mockPost: any): BlogPost {
  return {
    ...mockPost,
    // Add required fields from blog/types/blog that are missing in models/Blog
    contentFormat: (typeof mockPost.content === 'string' && mockPost.content.includes('```')) 
      ? 'markdown' 
      : 'html' as ContentFormat,
    publishDate: mockPost.publishedAt || mockPost.date || new Date().toISOString(),
    // Convert any string tags to objects if needed
    tags: Array.isArray(mockPost.tags) 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? mockPost.tags.map((tag: any) => typeof tag === 'string' ? { id: tag, name: tag, slug: tag } : tag)
      : [],
    // Ensure category is properly formatted (can be string or object)
    category: mockPost.category || 'Uncategorized'
  };
}

/**
 * Test function to validate field consistency between data sources
 */
export async function validateDataModel(): Promise<void> {
  try {
    console.log('=== BLOG SYSTEM DATA MODEL VALIDATION ===');
    console.log('Testing data model consistency between mock and Contentful sources...');
    
    // Get a post from each source
    const mockPostRaw = await mockService.getPostBySlug('getting-started-with-salesforce-development');
    // Use pagination parameter instead of limit
    const contentfulPosts = await contentfulService.getPosts({ 
      pagination: { limit: 1 } 
    });
    const contentfulPost = contentfulPosts.items.length > 0 ? contentfulPosts.items[0] : null;
    
    if (!mockPostRaw || !contentfulPost) {
      console.error('Unable to fetch test posts from both sources.');
      return;
    }
    
    // Adapt the mock post to the standardized format
    const mockPost = adaptMockPostToStandardFormat(mockPostRaw);
    
    // Log both posts for comparison
    console.log('\n=== MOCK POST ===');
    console.log(JSON.stringify(mockPost, null, 2));
    
    console.log('\n=== CONTENTFUL POST ===');
    console.log(JSON.stringify(contentfulPost, null, 2));
    
    // Validate field names
    console.log('\n=== FIELD VALIDATION ===');
    validateFields(mockPost, contentfulPost);
    
    // Test nested properties
    validateNestedProperties(mockPost, contentfulPost);
    
  } catch (error) {
    console.error('Error during data model validation:', error);
  }
}

/**
 * Validates that all fields follow the same naming convention
 */
function validateFields(mockPost: BlogPost, contentfulPost: BlogPost): void {
  const mockFields = Object.keys(mockPost).sort();
  const contentfulFields = Object.keys(contentfulPost).sort();
  
  console.log('Mock fields:', mockFields.join(', '));
  console.log('Contentful fields:', contentfulFields.join(', '));
  
  // Check for missing fields
  const missingInContentful = mockFields.filter(field => !contentfulFields.includes(field));
  const missingInMock = contentfulFields.filter(field => !mockFields.includes(field));
  
  if (missingInContentful.length === 0 && missingInMock.length === 0) {
    console.log('✅ All field names match between mock and Contentful data');
  } else {
    console.warn('⚠️ Field name differences found:');
    if (missingInContentful.length > 0) {
      console.warn('  Fields in Mock but missing in Contentful:', missingInContentful.join(', '));
    }
    if (missingInMock.length > 0) {
      console.warn('  Fields in Contentful but missing in Mock:', missingInMock.join(', '));
    }
  }
  
  // Check for publishDate vs publishedAt
  if ('publishDate' in mockPost && !('publishedAt' in mockPost)) {
    console.log('✅ Mock data uses standardized "publishDate" field');
  } else if ('publishedAt' in mockPost && !('publishDate' in mockPost)) {
    console.error('❌ Mock data uses non-standard "publishedAt" field instead of "publishDate"');
  }
  
  if ('publishDate' in contentfulPost && !('publishedAt' in contentfulPost)) {
    console.log('✅ Contentful data uses standardized "publishDate" field');
  } else if ('publishedAt' in contentfulPost && !('publishDate' in contentfulPost)) {
    console.error('❌ Contentful data uses non-standard "publishedAt" field instead of "publishDate"');
  }
}

/**
 * Validates nested properties like authors, tags, category, etc.
 */
function validateNestedProperties(mockPost: BlogPost, contentfulPost: BlogPost): void {
  console.log('\n=== NESTED PROPERTY VALIDATION ===');
  
  // Validate authors
  if (Array.isArray(mockPost.authors) && Array.isArray(contentfulPost.authors)) {
    console.log('✅ Authors are stored as arrays in both sources');
    
    if (mockPost.authors.length > 0 && contentfulPost.authors.length > 0) {
      const mockAuthorFields = Object.keys(mockPost.authors[0]).sort();
      const contentfulAuthorFields = Object.keys(contentfulPost.authors[0]).sort();
      
      console.log('Mock author fields:', mockAuthorFields.join(', '));
      console.log('Contentful author fields:', contentfulAuthorFields.join(', '));
    }
  } else {
    console.error('❌ Author data structure differs between sources');
  }
  
  // Validate tags
  if (Array.isArray(mockPost.tags) && Array.isArray(contentfulPost.tags)) {
    console.log('✅ Tags are stored as arrays in both sources');
    
    // Check if tags are objects or strings
    const mockTagType = typeof mockPost.tags[0] === 'object' ? 'object' : 'string';
    const contentfulTagType = typeof contentfulPost.tags[0] === 'object' ? 'object' : 'string'; 
    
    console.log(`Mock tags stored as: ${mockTagType}`);
    console.log(`Contentful tags stored as: ${contentfulTagType}`);
    
    if (mockTagType !== contentfulTagType) {
      console.warn('⚠️ Tag storage format differs between sources');
    }
  } else {
    console.error('❌ Tag data structure differs between sources');
  }
  
  // Validate category
  const mockCategoryType = typeof mockPost.category === 'object' ? 'object' : 'string';
  const contentfulCategoryType = typeof contentfulPost.category === 'object' ? 'object' : 'string';
  
  console.log(`Mock category stored as: ${mockCategoryType}`);
  console.log(`Contentful category stored as: ${contentfulCategoryType}`);
  
  if (mockCategoryType !== contentfulCategoryType) {
    console.warn('⚠️ Category storage format differs between sources');
  }
  
  // Validate table of contents
  if (mockPost.tocItems && contentfulPost.tocItems) {
    console.log('✅ Both sources include table of contents data');
  } else if (mockPost.tocItems && !contentfulPost.tocItems) {
    console.warn('⚠️ Table of contents only available in mock data');
  } else if (!mockPost.tocItems && contentfulPost.tocItems) {
    console.warn('⚠️ Table of contents only available in Contentful data');
  } else {
    console.error('❌ Table of contents missing from both sources');
  }
}

// Execute the test function
validateDataModel().then(() => {
  console.log('\nData model validation complete.');
}); 