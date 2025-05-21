/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Application Environment
  readonly VITE_APP_ENV?: 'development' | 'staging' | 'production';
  readonly VITE_DEBUG?: string;

  // Contentful Configuration
  readonly VITE_CONTENTFUL_SPACE_ID: string;
  readonly VITE_CONTENTFUL_ACCESS_TOKEN: string;
  readonly VITE_CONTENTFUL_PREVIEW_TOKEN?: string;
  readonly VITE_CONTENTFUL_ENVIRONMENT?: string;
  readonly VITE_CONTENTFUL_CACHE_TTL?: string;
  readonly VITE_CONTENTFUL_PREVIEW_MODE?: string;
  readonly VITE_CONTENTFUL_DEFAULT_LOCALE?: string;

  // Pexels Configuration
  readonly VITE_PEXELS_API_KEY: string;
  readonly VITE_PEXELS_CACHE_TTL?: string;
  readonly VITE_PEXELS_DEFAULT_PER_PAGE?: string;
  readonly VITE_PEXELS_ENABLE_FALLBACKS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
