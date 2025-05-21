import { BlogServiceInterface } from '../blog/services/interfaces/BlogServiceInterface';

// Mock content for blog service
const mockPosts = [
  {
    id: '1',
    title: 'Test Post 1',
    slug: 'test-post-1',
    excerpt: 'This is a test post excerpt',
    content: 'Test content for post 1',
    contentFormat: 'markdown',
    publishDate: '2023-12-01T10:00:00Z',
    authors: [{ id: '1', name: 'Test Author' }],
    category: { id: '1', name: 'Test Category', slug: 'test-category' },
    tags: [{ id: '1', name: 'Test Tag', slug: 'test-tag' }],
    readingTime: 3
  },
  {
    id: '2',
    title: 'Test Post 2',
    slug: 'test-post-2',
    excerpt: 'This is another test post excerpt',
    content: 'Test content for post 2',
    contentFormat: 'markdown',
    publishDate: '2023-12-05T10:00:00Z',
    authors: [{ id: '1', name: 'Test Author' }],
    category: { id: '1', name: 'Test Category', slug: 'test-category' },
    tags: [{ id: '2', name: 'Another Tag', slug: 'another-tag' }],
    readingTime: 5
  }
];

// Mock blog service implementation
const mockBlogService: BlogServiceInterface = {
  initialize: jest.fn().mockResolvedValue(undefined),
  getConnectionStatus: jest.fn().mockResolvedValue({ isConnected: true, lastChecked: Date.now() }),
  getPosts: jest.fn().mockResolvedValue({ 
    items: mockPosts, 
    total: mockPosts.length, 
    hasMore: false 
  }),
  getPostBySlug: jest.fn().mockImplementation((slug: string) => {
    const post = mockPosts.find(p => p.slug === slug);
    return Promise.resolve(post || null);
  }),
  getCategories: jest.fn().mockResolvedValue({ 
    items: [{ id: '1', name: 'Test Category', slug: 'test-category' }], 
    total: 1, 
    hasMore: false 
  }),
  getTags: jest.fn().mockResolvedValue({ 
    items: [
      { id: '1', name: 'Test Tag', slug: 'test-tag' },
      { id: '2', name: 'Another Tag', slug: 'another-tag' }
    ], 
    total: 2, 
    hasMore: false 
  }),
  getRelatedPosts: jest.fn().mockResolvedValue(mockPosts),
  getTrendingPosts: jest.fn().mockResolvedValue(mockPosts),
  clearCache: jest.fn()
};

// Export mock functions
export const getBlogService = jest.fn().mockReturnValue(mockBlogService);
export const getContentfulService = jest.fn().mockReturnValue({});

export default {
  getBlogService,
  getContentfulService
}; 