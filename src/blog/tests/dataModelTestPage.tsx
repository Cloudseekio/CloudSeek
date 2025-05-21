import React, { useState, useEffect } from 'react';
import { getContentfulService } from '../services/serviceFactory';
import MockBlogService from '../services/mockBlogService';
import { BlogPost, ContentFormat } from '../types/blog';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface ValidationResult {
  type: 'success' | 'warning' | 'error';
  message: string;
}

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

const DataModelTestPage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [mockPost, setMockPost] = useState<BlogPost | null>(null);
  const [contentfulPost, setContentfulPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const mockService = new MockBlogService();
        // Use the factory method to get the ContentfulService instance
        const contentfulService = getContentfulService();
        
        // Fetch posts from both sources
        const mockPostRaw = await mockService.getPostBySlug('getting-started-with-salesforce-development');
        const contentfulPosts = await contentfulService.getPosts();
        const contentfulPostData = contentfulPosts.items.length > 0 ? contentfulPosts.items[0] : null;
        
        if (!mockPostRaw || !contentfulPostData) {
          throw new Error('Unable to fetch post data from both sources');
        }
        
        // Adapt the mock post to the standardized format
        const adaptedMockPost = adaptMockPostToStandardFormat(mockPostRaw);
        
        setMockPost(adaptedMockPost);
        setContentfulPost(contentfulPostData);
        
        // Run validation
        const validationResults: ValidationResult[] = [];
        validateModels(adaptedMockPost, contentfulPostData, validationResults);
        
        setResults(validationResults);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error in data model test:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Helper function to validate models and add results
  function validateModels(mockPost: BlogPost, contentfulPost: BlogPost, results: ValidationResult[]) {
    // Check field names
    const mockFields = Object.keys(mockPost).sort();
    const contentfulFields = Object.keys(contentfulPost).sort();
    
    const missingInContentful = mockFields.filter(field => !contentfulFields.includes(field));
    const missingInMock = contentfulFields.filter(field => !mockFields.includes(field));
    
    if (missingInContentful.length === 0 && missingInMock.length === 0) {
      results.push({
        type: 'success',
        message: 'All field names match between mock and Contentful data'
      });
    } else {
      results.push({
        type: 'warning',
        message: 'Field name differences found between data sources'
      });
      
      if (missingInContentful.length > 0) {
        results.push({
          type: 'warning',
          message: `Fields in Mock but missing in Contentful: ${missingInContentful.join(', ')}`
        });
      }
      
      if (missingInMock.length > 0) {
        results.push({
          type: 'warning',
          message: `Fields in Contentful but missing in Mock: ${missingInMock.join(', ')}`
        });
      }
    }
    
    // Check date field naming
    if ('publishDate' in mockPost && !('publishedAt' in mockPost)) {
      results.push({
        type: 'success',
        message: 'Mock data uses standardized "publishDate" field'
      });
    } else if ('publishedAt' in mockPost && !('publishDate' in mockPost)) {
      results.push({
        type: 'error',
        message: 'Mock data uses non-standard "publishedAt" field instead of "publishDate"'
      });
    }
    
    if ('publishDate' in contentfulPost && !('publishedAt' in contentfulPost)) {
      results.push({
        type: 'success',
        message: 'Contentful data uses standardized "publishDate" field'
      });
    } else if ('publishedAt' in contentfulPost && !('publishDate' in contentfulPost)) {
      results.push({
        type: 'error',
        message: 'Contentful data uses non-standard "publishedAt" field instead of "publishDate"'
      });
    }
    
    // Validate authors
    if (Array.isArray(mockPost.authors) && Array.isArray(contentfulPost.authors)) {
      results.push({
        type: 'success',
        message: 'Authors are stored as arrays in both sources'
      });
    } else {
      results.push({
        type: 'error',
        message: 'Author data structure differs between sources'
      });
    }
    
    // Validate tags
    if (Array.isArray(mockPost.tags) && Array.isArray(contentfulPost.tags)) {
      results.push({
        type: 'success',
        message: 'Tags are stored as arrays in both sources'
      });
      
      const mockTagType = typeof mockPost.tags[0] === 'object' ? 'object' : 'string';
      const contentfulTagType = typeof contentfulPost.tags[0] === 'object' ? 'object' : 'string';
      
      if (mockTagType !== contentfulTagType) {
        results.push({
          type: 'warning',
          message: `Tag storage format differs: Mock (${mockTagType}) vs Contentful (${contentfulTagType})`
        });
      }
    } else {
      results.push({
        type: 'error',
        message: 'Tag data structure differs between sources'
      });
    }
    
    // Validate ToC
    if (mockPost.tocItems && contentfulPost.tocItems) {
      results.push({
        type: 'success',
        message: 'Both sources include table of contents data'
      });
    } else if (mockPost.tocItems || contentfulPost.tocItems) {
      results.push({
        type: 'warning',
        message: 'Table of contents only available in one data source'
      });
    } else {
      results.push({
        type: 'error',
        message: 'Table of contents missing from both sources'
      });
    }
  }
  
  const renderIcon = (type: 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={20} />;
    }
  };
  
  if (loading) {
    return (
      <div className="p-8">
        <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Data Model Validation
        </h1>
        <div className="animate-pulse">
          <div className={`h-6 w-3/4 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-4`}></div>
          <div className={`h-6 w-1/2 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-4`}></div>
          <div className={`h-6 w-2/3 ${isDark ? 'bg-gray-700' : 'bg-gray-300'} rounded mb-4`}></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8">
        <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Data Model Validation
        </h1>
        <div className={`p-4 rounded-md bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`}>
          <h2 className="text-lg font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Data Model Validation Results
      </h1>
      
      {/* Results section */}
      <div className="mb-8">
        <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Validation Checks
        </h2>
        <div className={`rounded-md border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {results.map((result, index) => (
              <li key={index} className="p-4 flex items-start gap-3">
                <div className="flex-shrink-0 pt-0.5">
                  {renderIcon(result.type)}
                </div>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {result.message}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Data comparison section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Mock Data Sample
          </h2>
          <div className={`p-4 rounded-md ${isDark ? 'bg-gray-800' : 'bg-gray-50'} overflow-auto max-h-[500px]`}>
            <pre className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {JSON.stringify(mockPost, null, 2)}
            </pre>
          </div>
        </div>
        
        <div>
          <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Contentful Data Sample
          </h2>
          <div className={`p-4 rounded-md ${isDark ? 'bg-gray-800' : 'bg-gray-50'} overflow-auto max-h-[500px]`}>
            <pre className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {JSON.stringify(contentfulPost, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataModelTestPage; 