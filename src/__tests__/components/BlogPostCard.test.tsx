import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import BlogPostCard from '../../blog/components/BlogPostCard';
import { BlogPost } from '../../blog/types/blog';

// Create more direct mocks
jest.mock('../../blog/components/OptimizedImage', () => ({
  __esModule: true,
  OptimizedImage: ({ src, alt, className }: { src: string, alt: string, className?: string }) => (
    <img src={src} alt={alt} className={className} data-testid="optimized-image" />
  ),
  default: ({ src, alt, className }: { src: string, alt: string, className?: string }) => (
    <img src={src} alt={alt} className={className} data-testid="optimized-image" />
  )
}));

jest.mock('../../utils/blogUtils', () => ({
  formatBlogDate: () => 'March 20, 2024',
  getReadingTime: () => 5
}));

jest.mock('../../utils/routes', () => ({
  getBlogPostUrl: (slug: string) => `/blog/${slug}`
}));

jest.mock('../../blog/utils/validation', () => ({
  validateBlogPost: (post: BlogPost) => {
    if (!post || !post.title) {
      throw new Error('Invalid blog post data');
    }
    return post;
  }
}));

jest.mock('../../blog/components/BlogPostSkeleton', () => ({
  __esModule: true,
  default: ({ className }: { className?: string }) => (
    <div className={className} data-testid="blog-post-skeleton" role="status">Loading...</div>
  )
}));

jest.mock('../../blog/components/error/ErrorMessage', () => ({
  __esModule: true,
  default: ({ title, message }: { title: string, message?: string }) => (
    <div data-testid="error-message">
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  )
}));

jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
}));

const mockPost: BlogPost = {
  id: '1',
  title: 'Test Post',
  slug: 'test-post',
  excerpt: 'This is a test post excerpt',
  content: 'Test content',
  contentFormat: 'markdown',
  publishDate: '2024-03-20T12:00:00Z',
  authors: [{
    id: '1',
    name: 'John Doe',
    avatar: 'test-avatar.jpg'
  }],
  category: {
    id: '1',
    name: 'Test Category',
    slug: 'test-category'
  },
  tags: [{
    id: '1',
    name: 'Test Tag',
    slug: 'test-tag'
  }],
  readingTime: 5,
  coverImage: {
    url: 'test-image.jpg',
    alt: 'Test Image'
  }
};

describe('BlogPostCard', () => {
  const user = userEvent.setup();

  const renderCard = (props = {}) => {
    return render(
      <MemoryRouter>
        <BlogPostCard post={mockPost} {...props} />
      </MemoryRouter>
    );
  };

  it('renders post title and excerpt', () => {
    const { getByText } = renderCard();
    expect(getByText('Test Post')).toBeInTheDocument();
    expect(getByText('This is a test post excerpt')).toBeInTheDocument();
  });

  it('renders post category', () => {
    const { getByText } = renderCard();
    expect(getByText('Test Category')).toBeInTheDocument();
  });

  it('renders author information', () => {
    const { getByText } = renderCard();
    expect(getByText('John Doe')).toBeInTheDocument();
  });

  it('renders post metadata', () => {
    const { getByText } = renderCard();
    expect(getByText(/March 20, 2024/)).toBeInTheDocument();
  });

  it('renders cover image', () => {
    const { getByAltText } = renderCard();
    const image = getByAltText('Test Image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
  });

  it('links to the full post', () => {
    const { getByRole } = renderCard();
    const link = getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });

  it('applies hover effect on card', async () => {
    const { getByTestId } = renderCard();
    const card = getByTestId('blog-post-card');
    await user.hover(card);
    expect(card).toHaveClass('group');
  });

  it('renders in compact mode when specified', () => {
    const { container, queryByText } = renderCard({ variant: 'compact' });
    expect(container.firstChild).toHaveClass('h-[280px]');
    expect(queryByText('This is a test post excerpt')).not.toBeInTheDocument();
  });

  it('renders in featured mode when specified', () => {
    const { container } = renderCard({ variant: 'featured' });
    expect(container.firstChild).toHaveClass('h-[420px]');
  });

  it('renders loading skeleton when loading prop is true', () => {
    const { getByRole } = renderCard({ loading: true });
    expect(getByRole('status')).toBeInTheDocument();
  });

  it('handles missing cover image', () => {
    const postWithoutImage = {
      ...mockPost,
      coverImage: undefined
    };

    const { getByAltText } = render(
      <MemoryRouter>
        <BlogPostCard post={postWithoutImage} />
      </MemoryRouter>
    );

    const image = getByAltText('Test Post');
    expect(image).toHaveAttribute('src', '/images/placeholder.jpg');
  });

  it('handles missing author', () => {
    const postWithoutAuthor = {
      ...mockPost,
      authors: []
    };

    const { getByText } = render(
      <MemoryRouter>
        <BlogPostCard post={postWithoutAuthor} />
      </MemoryRouter>
    );

    expect(getByText('Unknown Author')).toBeInTheDocument();
  });

  it('displays error message for invalid post data', () => {
    const invalidPost = {
      ...mockPost,
      title: undefined,
      contentFormat: 'markdown',
      publishDate: '2024-03-20T12:00:00Z'
    } as unknown as BlogPost;

    const { getByText } = render(
      <MemoryRouter>
        <BlogPostCard post={invalidPost} />
      </MemoryRouter>
    );

    expect(getByText('Invalid Blog Post')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = renderCard({ className: 'custom-class' });
    expect(container.firstChild).toHaveClass('custom-class');
  });
}); 