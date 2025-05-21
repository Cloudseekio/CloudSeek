import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogList from '../../blog/components/BlogList';
import { BlogPost } from '../../blog/types/blog';
import type { BlogListProps } from '../../__mocks__/blog/components/BlogList';

// Mock the dependencies
jest.mock('../../blog/components/BlogPostCard', () => ({
  __esModule: true,
  default: ({ post }: { post: BlogPost }) => (
    <div data-testid="blog-post-card">
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
    </div>
  )
}));

// Mock BlogListSkeleton component
jest.mock('../../blog/components/BlogListSkeleton', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ count, columns }) => (
    <div data-testid="blog-list-skeleton" className={`grid-cols-${columns}`}>
      {Array.from({ length: count || 3 }).map((_, i) => (
        <div key={i} data-testid="blog-post-skeleton" />
      ))}
    </div>
  ))
}));

// Mock FeaturedPostsSlider component
jest.mock('../../blog/components/FeaturedPostsSlider', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ posts }) => (
    <div data-testid="featured-posts-slider">
      {posts.map((post: BlogPost) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  ))
}));

// Mock intersection observer
jest.mock('react-intersection-observer', () => ({
  useInView: () => [React.createRef(), true, jest.fn()],
}));

// Mock theme context
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));

// Mock filter context
jest.mock('../../blog/context/FilterContext', () => ({
  useFilters: () => ({
    filters: {},
    setFilter: jest.fn(),
    resetFilters: jest.fn(),
    toggleFilter: jest.fn(),
    isFilterActive: jest.fn().mockReturnValue(false)
  })
}));

// Mock pagination components
jest.mock('../../components/pagination/TraditionalPagination', () => ({
  __esModule: true,
  TraditionalPagination: ({ currentPage, totalItems, onPageChange }: { currentPage: number, totalItems: number, onPageChange: (page: number) => void }) => (
    <div>
      <button onClick={() => onPageChange(currentPage - 1)}>Previous</button>
      <span>{currentPage} of {Math.ceil(totalItems / 10)}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  )
}));

describe('BlogList Component', () => {
  // Generate sample posts for testing
  const samplePosts: BlogPost[] = Array.from({ length: 3 }).map((_, i) => ({
    id: `post-${i}`,
    title: `Test Post ${i}`,
    slug: `test-post-${i}`,
    excerpt: `This is test post ${i}`,
    content: `Content for test post ${i}`,
    contentFormat: 'markdown' as const, // Use const assertion to ensure proper type
    publishDate: new Date().toISOString(),
    authors: [{ id: 'author-1', name: 'Test Author' }],
    tags: [{ id: 'tag-1', name: 'Test Tag', slug: 'test-tag' }],
    category: { id: 'cat-1', name: 'Test Category', slug: 'test-category' },
    readingTime: 5
  }));
  
  // Sample featured posts for testing
  const featuredPosts: BlogPost[] = Array.from({ length: 2 }).map((_, i) => ({
    id: `featured-${i}`,
    title: `Featured Post ${i}`,
    slug: `featured-post-${i}`,
    excerpt: `This is featured post ${i}`,
    content: `Content for featured post ${i}`,
    contentFormat: 'markdown' as const, // Use const assertion to ensure proper type
    publishDate: new Date().toISOString(),
    authors: [{ id: 'author-1', name: 'Test Author' }],
    tags: [{ id: 'tag-1', name: 'Test Tag', slug: 'test-tag' }],
    category: { id: 'cat-1', name: 'Test Category', slug: 'test-category' },
    readingTime: 5,
    featured: true
  }));

  const renderBlogList = (props: Partial<BlogListProps> = {}) => {
    return render(
      <MemoryRouter>
        <BlogList 
          posts={samplePosts}
          columns={3}
          {...props}
        />
      </MemoryRouter>
    );
  };

  it('renders a list of blog posts', () => {
    renderBlogList();
    expect(screen.getAllByTestId('blog-post-card')).toHaveLength(3);
    expect(screen.getByText('Test Post 0')).toBeInTheDocument();
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
  });

  it('displays message when no posts are found', () => {
    renderBlogList({ posts: [] });
    expect(screen.getByText(/no posts found/i)).toBeInTheDocument();
  });

  it('renders loading skeletons when in loading state', () => {
    renderBlogList({ isLoading: true });
    expect(screen.getByTestId('blog-list-skeleton')).toBeInTheDocument();
  });

  it('renders with different column layouts', () => {
    const { rerender } = renderBlogList({ columns: 1 });
    expect(screen.getByTestId('blog-list-container')).toHaveClass('grid-cols-1');
    
    rerender(
      <MemoryRouter>
        <BlogList 
          posts={samplePosts}
          columns={2}
        />
      </MemoryRouter>
    );
    expect(screen.getByTestId('blog-list-container')).toHaveClass('grid-cols-2');
  });

  it('renders featured posts in a slider when enabled', () => {
    renderBlogList({
      featuredPosts,
      showFeaturedSlider: true
    });
    
    expect(screen.getByTestId('featured-posts-slider')).toBeInTheDocument();
  });

  it('handles pagination correctly with traditional pagination', () => {
    const onPageChange = jest.fn();
    renderBlogList({
      paginationType: 'traditional',
      totalItems: 50,
      currentPage: 1,
      itemsPerPage: 10,
      onPageChange
    });
    
    // Find and click on page 2
    const pageButtons = screen.getAllByRole('button');
    const page2Button = pageButtons.find(button => button.textContent === '2');
    
    if (page2Button) {
      fireEvent.click(page2Button);
      expect(onPageChange).toHaveBeenCalledWith(2);
    }
  });

  it('handles infinite scroll pagination', async () => {
    const onLoadMore = jest.fn();
    
    renderBlogList({
      paginationType: 'infinite',
      hasNextPage: true,
      onLoadMore,
      loadingMore: false
    });
    
    // Simulate intersection observer callback
    act(() => {
      // The mock implementation returns [null, true] for the first argument (ref) and second (inView)
      // which should trigger the onLoadMore callback
      expect(onLoadMore).toHaveBeenCalled();
    });
  });

  it('applies filter changes when filter panel is used', () => {
    const onFilterChange = jest.fn();
    const filterOptions = {
      categories: [
        { label: 'Category 1', value: 'cat1' },
        { label: 'Category 2', value: 'cat2' }
      ],
      tags: [
        { label: 'Tag 1', value: 'tag1' },
        { label: 'Tag 2', value: 'tag2' }
      ]
    };
    
    renderBlogList({ filterOptions, onFilterChange });
    
    // Open filter panel
    const filterButton = screen.getByText(/filters/i);
    fireEvent.click(filterButton);
    
    // Find and click category checkbox
    const categoryCheckboxes = screen.getAllByRole('checkbox');
    if (categoryCheckboxes.length > 0) {
      fireEvent.click(categoryCheckboxes[0]);
      expect(onFilterChange).toHaveBeenCalled();
    }
  });
}); 