import { Entry, Asset, AssetFile, EntrySkeletonType, EntryFields } from 'contentful';
import { Document } from '@contentful/rich-text-types';
import { PexelsImage } from '../../lib/pexels';
import { ContentFormat, BlogStatus } from './blog';

// Base asset types
export interface AssetFields {
  title: EntryFields.Text;
  description?: EntryFields.Text;
  file: {
    url: string;
    details: {
      size: number;
      image?: {
        width: number;
        height: number;
      };
    };
    fileName: string;
    contentType: string;
  };
}

// Contentful-specific asset types
export interface ContentfulAssetFile extends AssetFile {
  url: string;
  details: {
    size: number;
    image?: {
      width: number;
      height: number;
    };
  };
  fileName: string;
  contentType: string;
}

export interface ContentfulAssetFields {
  title: string;
  description?: string;
  file: ContentfulAssetFile;
}

export type ContentfulAsset = Asset;

// Combined asset type for the application
export type CombinedAsset = ContentfulAsset | PexelsImage;

// Type guards for asset types
export const isContentfulAsset = (asset: unknown): asset is ContentfulAsset => {
  if (!asset || typeof asset !== 'object') return false;
  const assetObj = asset as { sys?: { type?: string }; fields?: { file?: unknown } };
  return !!(
    assetObj.sys?.type === 'Asset' &&
    assetObj.fields?.file
  );
};

export const isPexelsAsset = (asset: unknown): asset is PexelsImage => {
  if (!asset || typeof asset !== 'object') return false;
  const assetObj = asset as { src?: unknown; photographer?: unknown; photographerUrl?: unknown };
  return !!(
    assetObj.src &&
    assetObj.photographer &&
    assetObj.photographerUrl
  );
};

export const isAsset = (asset: unknown): asset is CombinedAsset => {
  return isContentfulAsset(asset) || isPexelsAsset(asset);
};

// Entry types
export interface AuthorFields extends EntrySkeletonType {
  contentTypeId: 'author';
  fields: {
    name: EntryFields.Text;
    bio?: EntryFields.Text;
    avatar?: ContentfulAsset;
    email?: EntryFields.Text;
    social?: Record<string, EntryFields.Text>;
  };
}

export interface CategoryFields extends EntrySkeletonType {
  contentTypeId: 'category';
  fields: {
    name: EntryFields.Text;
    slug: EntryFields.Text;
    description?: EntryFields.Text;
  };
}

export interface TagFields extends EntrySkeletonType {
  contentTypeId: 'tag';
  fields: {
    name: EntryFields.Text;
    slug: EntryFields.Text;
  };
}

export interface ContentfulFields extends EntrySkeletonType {
  contentTypeId: 'blogpost';
  fields: {
    title: string;
    slug: string;
    content?: Document;
    excerpt?: string;
    coverImage?: ContentfulAsset | PexelsImage;
    authors?: Entry<AuthorFields>[];
    category?: Entry<CategoryFields>;
    tags?: Entry<TagFields>[];
    featured?: boolean;
    publishDate?: string;
    contentFormat: ContentFormat;
    status: BlogStatus;
  };
}

export type ContentfulBlogPost = Entry<ContentfulFields>;
export type ContentfulAuthor = Entry<AuthorFields>;
export type ContentfulCategory = Entry<CategoryFields>;
export type ContentfulTag = Entry<TagFields>;

export const isRichText = (content: unknown): content is Document => {
  return content !== null && typeof content === 'object' && 'nodeType' in content;
};

export const isAuthorEntry = (entry: Entry<EntrySkeletonType>): entry is Entry<AuthorFields> => {
  return entry.sys.contentType.sys.id === 'author';
};

export const isCategoryEntry = (entry: Entry<EntrySkeletonType>): entry is Entry<CategoryFields> => {
  return entry.sys.contentType.sys.id === 'category';
};

export const isTagEntry = (entry: Entry<EntrySkeletonType>): entry is Entry<TagFields> => {
  return entry.sys.contentType.sys.id === 'tag';
};

export const isBlogPostEntry = (entry: Entry<EntrySkeletonType>): entry is Entry<ContentfulFields> => {
  // Check if entry is an object and has sys.contentType.sys.id property
  if (!entry || typeof entry !== 'object' || !entry.sys || !entry.sys.contentType || !entry.sys.contentType.sys) {
    return false;
  }
  
  const contentTypeId = entry.sys.contentType.sys.id;
  return contentTypeId === 'blogpost';
};

export interface BlogPostFields {
  title: EntryFields.Text;
  slug: EntryFields.Text;
  excerpt?: EntryFields.Text;
  content: string | Document;
  contentFormat: ContentFormat;
  authors: Entry<AuthorFields>[];
  category: Entry<CategoryFields>;
  tags: Entry<TagFields>[];
  coverImage?: Asset;
  featured: EntryFields.Boolean;
  status: BlogStatus;
}

export interface CategoryFields {
  name: EntryFields.Text;
  slug: EntryFields.Text;
  description?: EntryFields.Text;
}

export interface TagFields {
  name: EntryFields.Text;
  slug: EntryFields.Text;
}

export interface AuthorFields {
  name: EntryFields.Text;
  bio?: EntryFields.Text;
  avatar?: Asset;
  email?: EntryFields.Text;
  social?: Record<string, EntryFields.Text>;
}

export interface AssetFields {
  title: EntryFields.Text;
  description?: EntryFields.Text;
  file: {
    url: string;
    details: {
      size: number;
      image?: {
        width: number;
        height: number;
      };
    };
    fileName: string;
    contentType: string;
  };
}

export interface BlogPostSkeleton extends EntrySkeletonType {
  contentTypeId: 'blogPost';
  fields: {
    title: EntryFields.Text;
    slug: EntryFields.Text;
    excerpt?: EntryFields.Text;
    content: string | Document;
    contentFormat: ContentFormat;
    authors: Entry<AuthorSkeleton>[];
    category: Entry<CategorySkeleton>;
    tags: Entry<TagSkeleton>[];
    coverImage?: Asset;
    featured: EntryFields.Boolean;
    status: BlogStatus;
  };
}

export interface CategorySkeleton extends EntrySkeletonType {
  contentTypeId: 'category';
  fields: {
    name: EntryFields.Text;
    slug: EntryFields.Text;
    description?: EntryFields.Text;
  };
}

export interface TagSkeleton extends EntrySkeletonType {
  contentTypeId: 'tag';
  fields: {
    name: EntryFields.Text;
    slug: EntryFields.Text;
  };
}

export interface AuthorSkeleton extends EntrySkeletonType {
  contentTypeId: 'author';
  fields: {
    name: EntryFields.Text;
    bio?: EntryFields.Text;
    avatar?: Asset;
    email?: EntryFields.Text;
    social?: Record<string, EntryFields.Text>;
  };
}

export interface AssetSkeleton extends EntrySkeletonType {
  contentTypeId: 'asset';
  fields: {
    title: EntryFields.Text;
    description?: EntryFields.Text;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

// Type aliases for Entry types
export type BlogPostEntry = Entry<BlogPostSkeleton['fields']>;
export type CategoryEntry = Entry<CategorySkeleton['fields']>;
export type TagEntry = Entry<TagSkeleton['fields']>;
export type AuthorEntry = Entry<AuthorSkeleton['fields']>;
export type AssetEntry = Entry<AssetSkeleton['fields']>; 