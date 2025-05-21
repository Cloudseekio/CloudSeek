import { useMemo } from 'react';

export function useGetBlogUrl() {
  return useMemo(() => {
    return {
      getBlogPostUrl: (slug: string) => `/blog/${slug}`,
      getBlogCategoryUrl: (slug: string) => `/blog/category/${slug}`,
      getBlogTagUrl: (slug: string) => `/blog/tag/${slug}`,
      getBlogAuthorUrl: (slug: string) => `/blog/author/${slug}`,
    };
  }, []);
}

export default useGetBlogUrl; 