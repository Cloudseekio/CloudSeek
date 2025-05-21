import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogListSkeleton from '../../../blog/components/BlogListSkeleton';
import BlogSidebarSkeleton from '../../../blog/components/BlogSidebarSkeleton';
import BlogHeaderSkeleton from '../../../blog/components/BlogHeaderSkeleton';
import { SkeletonText, SkeletonImage } from '../../../components/skeleton';

describe('Skeleton Components', () => {
  describe('Base Skeleton Components', () => {
    it('renders SkeletonText with correct width', () => {
      render(<SkeletonText width="50%" />);
      const skeleton = screen.getByTestId('skeleton-text');
      expect(skeleton).toHaveStyle({ width: '50%' });
    });

    it('renders SkeletonImage with correct dimensions', () => {
      render(<SkeletonImage width={200} height={150} />);
      const skeleton = screen.getByTestId('skeleton-image');
      expect(skeleton).toHaveStyle({
        width: '200px',
        height: '150px'
      });
    });
  });

  describe('Blog Skeleton Components', () => {
    it('renders BlogListSkeleton with correct number of items', () => {
      render(<BlogListSkeleton count={3} />);
      const items = screen.getAllByTestId('blog-list-item-skeleton');
      expect(items).toHaveLength(3);
    });

    it('renders BlogSidebarSkeleton with categories and tags', () => {
      render(<BlogSidebarSkeleton />);
      expect(screen.getByTestId('categories-skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('tags-skeleton')).toBeInTheDocument();
    });

    it('renders BlogHeaderSkeleton with title and metadata', () => {
      render(<BlogHeaderSkeleton />);
      expect(screen.getByTestId('blog-header-title-skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('blog-header-meta-skeleton')).toBeInTheDocument();
    });
  });

  describe('Skeleton Animations', () => {
    it('applies pulse animation to skeletons', () => {
      render(<SkeletonText />);
      const skeleton = screen.getByTestId('skeleton-text');
      expect(skeleton.querySelector('div')).toHaveClass('animate-pulse');
    });

    it('supports disabling animation', () => {
      render(<SkeletonText animate={false} />);
      const skeleton = screen.getByTestId('skeleton-text');
      expect(skeleton.querySelector('div')).not.toHaveClass('animate-pulse');
    });
  });

  describe('Skeleton Accessibility', () => {
    it('includes proper ARIA attributes', () => {
      render(<BlogListSkeleton count={1} />);
      const skeleton = screen.getByTestId('blog-list-skeleton');
      expect(skeleton).toHaveAttribute('role', 'status');
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading blog posts');
    });

    it('supports custom aria labels', () => {
      render(<SkeletonText aria-label="Custom loading text" />);
      const skeleton = screen.getByTestId('skeleton-text');
      expect(skeleton).toHaveAttribute('aria-label', 'Custom loading text');
    });
  });
}); 