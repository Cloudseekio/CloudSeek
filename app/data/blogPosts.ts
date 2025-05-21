export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  imageUrl: string;
  slug: string;
  isFeatured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of React Development in 2024',
    excerpt: 'Explore the latest trends and best practices in React development, including Server Components, Suspense, and the new React compiler.',
    date: 'March 15, 2024',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    category: 'React',
    imageUrl: 'https://picsum.photos/seed/react2024/1200/800',
    slug: 'future-of-react-2024',
    isFeatured: true
  },
  {
    id: '2',
    title: 'Building Scalable APIs with Next.js',
    excerpt: 'Learn how to create robust and scalable API routes using Next.js, including authentication, rate limiting, and error handling.',
    date: 'March 12, 2024',
    author: {
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?u=michael'
    },
    category: 'Next.js',
    imageUrl: 'https://picsum.photos/seed/nextjs-api/1200/800',
    slug: 'scalable-apis-nextjs',
    isFeatured: true
  },
  {
    id: '3',
    title: 'Mastering TypeScript: Advanced Patterns',
    excerpt: 'Deep dive into advanced TypeScript patterns including generics, utility types, and decorators for better type safety.',
    date: 'March 10, 2024',
    author: {
      name: 'Emma Wilson',
      avatar: '/avatars/emma.jpg'
    },
    category: 'TypeScript',
    imageUrl: '/blog/typescript-patterns.jpg',
    slug: 'mastering-typescript-patterns',
    isFeatured: true
  },
  {
    id: '4',
    title: 'State Management with Zustand',
    excerpt: 'Discover why Zustand is becoming a popular choice for React state management and how to use it effectively.',
    date: 'March 8, 2024',
    author: {
      name: 'Alex Turner',
      avatar: '/avatars/alex.jpg'
    },
    category: 'State Management',
    imageUrl: '/blog/zustand.jpg',
    slug: 'state-management-zustand',
    isFeatured: false
  },
  {
    id: '5',
    title: 'CSS-in-JS vs. Tailwind CSS',
    excerpt: 'A comprehensive comparison of CSS-in-JS solutions and Tailwind CSS, helping you choose the right styling approach.',
    date: 'March 5, 2024',
    author: {
      name: 'Lisa Park',
      avatar: '/avatars/lisa.jpg'
    },
    category: 'CSS',
    imageUrl: '/blog/css-comparison.jpg',
    slug: 'css-in-js-vs-tailwind',
    isFeatured: false
  },
  {
    id: '6',
    title: 'Web Performance Optimization Tips',
    excerpt: 'Essential techniques for optimizing your web application performance, from code splitting to image optimization.',
    date: 'March 3, 2024',
    author: {
      name: 'David Brown',
      avatar: '/avatars/david.jpg'
    },
    category: 'Performance',
    imageUrl: '/blog/web-performance.jpg',
    slug: 'web-performance-tips',
    isFeatured: false
  }
]; 