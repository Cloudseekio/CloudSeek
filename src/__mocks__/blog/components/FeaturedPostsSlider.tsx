import React from 'react';
import { BlogPost } from '../../../models/Blog';

interface FeaturedPostsSliderProps {
  posts: BlogPost[];
}

const FeaturedPostsSlider: React.FC<FeaturedPostsSliderProps> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <div 
      data-testid="featured-posts-slider"
      className="mock-featured-posts-slider"
    >
      {posts.map((post) => (
        <div key={post.id} className="mock-slide">
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </div>
  );
};

export default FeaturedPostsSlider; 