import React from 'react';
import { BlogPost } from '../../../blog/types/blog';

interface RelatedPostsProps {
  posts: BlogPost[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  return (
    <div data-testid="related-posts">
      <h3>Related Posts</h3>
      <div className="related-posts-grid">
        {posts.map(post => (
          <div key={post.id} className="related-post-card">
            <h4>{post.title}</h4>
            {post.excerpt && <p>{post.excerpt}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts; 