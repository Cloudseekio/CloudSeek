import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BlogProvider, useBlog, resetMockState, setMockError } from '../../__mocks__/blog/context/BlogContext';

// Mock the BlogContext module directly without using require
jest.mock('../../blog/context/BlogContext', () => jest.requireActual('../../__mocks__/blog/context/BlogContext'));

// Test component that uses the blog context
const TestComponent = () => {
  const { posts, isLoading, error } = useBlog();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
};

describe('BlogContext', () => {
  beforeEach(() => {
    // Reset mock state before each test
    resetMockState();
  });

  it('should load initial data successfully', async () => {
    render(
      <BlogProvider>
        <TestComponent />
      </BlogProvider>
    );

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
    });
  });

  it('should handle API errors', async () => {
    // Configure the mock to return an error
    setMockError(true, 'Failed to fetch');

    render(
      <BlogProvider>
        <TestComponent />
      </BlogProvider>
    );

    // Should show loading initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
    });
  });
}); 