export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  email?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface BlogVersion {
  id: string;
  content: string;
  updatedAt: string;
  updatedBy: string;
  versionNumber: number;
  comments?: string;
}

export interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  type: 'related' | 'recommended' | 'popular';
}

export interface BlogImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  source?: 'contentful' | 'pexels';
  photographer?: string;
  photographerUrl?: string;
}

export interface SEOMetadata {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  keywords?: string[];
}

export interface RichTextContent {
  nodeType: string;
  data: Record<string, unknown>;
  content: RichTextNode[];
  value?: string;
}

export interface RichTextNode {
  nodeType: string;
  data: Record<string, unknown>;
  content?: RichTextNode[];
  value?: string;
  marks?: { type: string }[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt?: string;
  authors: Author[];
  category?: BlogCategory;
  tags: BlogTag[];
  coverImage?: BlogImage;
  readingTime: number;
  featured?: boolean;
  relatedPosts?: BlogPost[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: Comment[];
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  author?: string;
  featured?: boolean;
  search?: string;
  sortBy?: 'date' | 'title' | 'popularity';
  order?: 'asc' | 'desc';
} 