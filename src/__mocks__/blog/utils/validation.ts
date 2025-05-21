import { BlogPost } from '../../../blog/types/blog';

/**
 * Mock implementation that simply returns the post as is
 */
export function validateBlogPost(post: BlogPost): BlogPost {
  if (!post || !post.title) {
    throw new Error('Invalid blog post data');
  }
  return post;
}

export default { validateBlogPost }; 