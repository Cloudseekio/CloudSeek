import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogDetail from '../../blog/components/BlogDetail';
import { BlogPost } from '../../blog/types/blog';

// Mock dependencies
jest.mock('../../blog/components/RichTextRenderer', () => ({
  __esModule: true,
  default: ({ content }: { content: any }) => <div data-testid="rich-text-content">Mocked Rich Text</div>
}));

jest.mock('../../blog/components/MarkdownRenderer', () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => <div data-testid="markdown-content">{content}</div>
}));

jest.mock('../../blog/components/HTMLRenderer', () => ({
  __esModule: true,
  default: ({ content }: { content: string }) => <div data-testid="html-content" dangerouslySetInnerHTML={{ __html: content }} />
}));

jest.mock('../../blog/components/TableOfContents', () => ({
  __esModule: true,
  default: ({ items }: { items: any[] }) => <div data-testid="table-of-contents">Mocked TOC</div>
}));

jest.mock('../../blog/components/RelatedPosts', () => ({
  __esModule: true,
  default: ({ posts }: { posts: any[] }) => <div data-testid="related-posts">Related Posts</div>
}));

jest.mock('../../blog/components/social/SocialShare', () => ({
  __esModule: true,
  default: ({ url, title }: { url: string, title: string }) => (
    <div data-testid="social-share">Share: {title}</div>
  )
}));

jest.mock('../../utils/blogUtils', () => ({
  formatBlogDate: (date: string) => 'March 15, 2024'
}));

const mockPost: BlogPost = {
  id: '1',
  title: 'Test Blog Post',
  slug: 'test-blog-post',
  excerpt: 'This is a test blog post excerpt.',
  content: 'This is the main content of the test blog post.',
  contentFormat: 'markdown',
  publishDate: '2024-03-15T12:00:00Z',
  authors: [
    {
      id: '1',
      name: 'Test Author',
      bio: 'Test author bio',
      avatar: 'test-avatar.jpg'
    }
  ],
  category: {
    id: '1',
    name: 'Test Category',
    slug: 'test-category'
  },
  tags: [
    {
      id: '1',
      name: 'Test Tag',
      slug: 'test-tag'
    },
    {
      id: '2',
      name: 'Another Tag',
      slug: 'another-tag'
    }
  ],
  coverImage: {
    url: 'test-cover.jpg',
    alt: 'Test Cover Image'
  },
  readingTime: 5,
  tocItems: [
    {
      id: 'heading-1',
      text: 'Heading 1',
      level: 2
    },
    {
      id: 'heading-2',
      text: 'Heading 2',
      level: 2
    }
  ],
  relatedPosts: [
    {
      id: '2',
      title: 'Related Post',
      slug: 'related-post',
      type: 'related'
    }
  ]
};

describe('BlogDetail Component', () => {
  const renderBlogDetail = (props = {}) => {
    return render(
      <MemoryRouter>
        <BlogDetail 
          post={mockPost} 
          isLoading={false}
          {...props} 
        />
      </MemoryRouter>
    );
  };

  it('renders the blog post title and metadata', () => {
    renderBlogDetail();
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('March 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('renders markdown content when contentFormat is markdown', () => {
    renderBlogDetail();
    expect(screen.getByTestId('markdown-content')).toBeInTheDocument();
  });

  it('renders rich text content when contentFormat is richText', () => {
    const richTextPost = {
      ...mockPost,
      contentFormat: 'richText',
      rawContent: { nodeType: 'document', content: [] }
    };
    
    renderBlogDetail({ post: richTextPost });
    expect(screen.getByTestId('rich-text-content')).toBeInTheDocument();
  });

  it('renders HTML content when contentFormat is html', () => {
    const htmlPost = {
      ...mockPost,
      contentFormat: 'html',
      content: '<p>HTML content</p>'
    };
    
    renderBlogDetail({ post: htmlPost });
    expect(screen.getByTestId('html-content')).toBeInTheDocument();
  });

  it('renders the cover image when provided', () => {
    renderBlogDetail();
    const coverImage = screen.getByAltText('Test Cover Image');
    expect(coverImage).toBeInTheDocument();
    expect(coverImage).toHaveAttribute('src', 'test-cover.jpg');
  });

  it('renders category and tags', () => {
    renderBlogDetail();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('Test Tag')).toBeInTheDocument();
    expect(screen.getByText('Another Tag')).toBeInTheDocument();
  });

  it('renders the table of contents when tocItems are provided', () => {
    renderBlogDetail();
    expect(screen.getByTestId('table-of-contents')).toBeInTheDocument();
  });

  it('renders related posts when provided', () => {
    renderBlogDetail();
    expect(screen.getByTestId('related-posts')).toBeInTheDocument();
  });

  it('renders social sharing buttons', () => {
    renderBlogDetail();
    expect(screen.getByTestId('social-share')).toBeInTheDocument();
  });

  it('renders loading skeleton when isLoading is true', () => {
    renderBlogDetail({ isLoading: true });
    expect(screen.getByTestId('blog-post-skeleton')).toBeInTheDocument();
  });

  it('renders error message when post is invalid', () => {
    renderBlogDetail({ post: undefined });
    expect(screen.getByText(/post not found/i)).toBeInTheDocument();
  });
});