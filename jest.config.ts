export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^../blog/services/serviceFactory$': '<rootDir>/src/__mocks__/serviceFactory.ts',
    '^../../blog/services/serviceFactory$': '<rootDir>/src/__mocks__/serviceFactory.ts',
    '^../../services/serviceFactory$': '<rootDir>/src/__mocks__/serviceFactory.ts',
    '^../../blog/components/OptimizedImage$': '<rootDir>/src/__mocks__/blog/components/OptimizedImage.tsx',
    '^../../components/OptimizedImage$': '<rootDir>/src/__mocks__/blog/components/OptimizedImage.tsx',
    '^../components/OptimizedImage$': '<rootDir>/src/__mocks__/blog/components/OptimizedImage.tsx',
    '^../../utils/cn$': '<rootDir>/src/__mocks__/utils/cn.ts',
    '^../utils/cn$': '<rootDir>/src/__mocks__/utils/cn.ts',
    '^../utils/validation$': '<rootDir>/src/__mocks__/blog/utils/validation.ts',
    '^../../blog/utils/validation$': '<rootDir>/src/__mocks__/blog/utils/validation.ts',
    '^../../utils/blogUtils$': '<rootDir>/src/__mocks__/utils/blogUtils.ts',
    '^../utils/blogUtils$': '<rootDir>/src/__mocks__/utils/blogUtils.ts',
    '^../../utils/routes$': '<rootDir>/src/__mocks__/utils/routes.ts',
    '^../utils/routes$': '<rootDir>/src/__mocks__/utils/routes.ts',
    '^../../utils/animationPerformance$': '<rootDir>/src/__mocks__/utils/animationPerformance.ts',
    '^../utils/animationPerformance$': '<rootDir>/src/__mocks__/utils/animationPerformance.ts',
    '^../../../utils/animationPerformance$': '<rootDir>/src/__mocks__/utils/animationPerformance.ts',
    '^../components/error/ErrorMessage$': '<rootDir>/src/__mocks__/blog/components/error/ErrorMessage.tsx',
    '^../../blog/components/error/ErrorMessage$': '<rootDir>/src/__mocks__/blog/components/error/ErrorMessage.tsx',
    '^../components/BlogPostSkeleton$': '<rootDir>/src/__mocks__/blog/components/BlogPostSkeleton.tsx',
    '^../../blog/components/BlogPostSkeleton$': '<rootDir>/src/__mocks__/blog/components/BlogPostSkeleton.tsx',
    '^../../utils/logger$': '<rootDir>/src/__mocks__/utils/logger.ts',
    '^../utils/logger$': '<rootDir>/src/__mocks__/utils/logger.ts',
    '^../../../utils/paginationUtils$': '<rootDir>/src/__mocks__/utils/paginationUtils.ts',
    '^../../utils/paginationUtils$': '<rootDir>/src/__mocks__/utils/paginationUtils.ts',
    '^../utils/paginationUtils$': '<rootDir>/src/__mocks__/utils/paginationUtils.ts',
    '^../../components/pagination/PaginationBase$': '<rootDir>/src/__mocks__/components/pagination/PaginationBase.tsx',
    '^../components/pagination/PaginationBase$': '<rootDir>/src/__mocks__/components/pagination/PaginationBase.tsx',
    '^../../blog/components/skeletons/BlogListSkeleton$': '<rootDir>/src/__mocks__/blog/components/skeletons/BlogListSkeleton.tsx',
    '^../components/skeletons/BlogListSkeleton$': '<rootDir>/src/__mocks__/blog/components/skeletons/BlogListSkeleton.tsx',
    '^.*/blog/services/serviceFactory$': '<rootDir>/src/__mocks__/blog/services/serviceFactory.ts',
    '^../../blog/components/BlogList$': '<rootDir>/src/__mocks__/blog/components/BlogList.tsx',
    '^../components/BlogList$': '<rootDir>/src/__mocks__/blog/components/BlogList.tsx',
    '^../../blog/components/FeaturedPostsSlider$': '<rootDir>/src/__mocks__/blog/components/FeaturedPostsSlider.tsx',
    '^../components/FeaturedPostsSlider$': '<rootDir>/src/__mocks__/blog/components/FeaturedPostsSlider.tsx',
    '^../../blog/components/BlogDetail$': '<rootDir>/src/__mocks__/blog/components/BlogDetail.tsx',
    '^../components/BlogDetail$': '<rootDir>/src/__mocks__/blog/components/BlogDetail.tsx',
    '^../../blog/components/MarkdownRenderer$': '<rootDir>/src/__mocks__/blog/components/MarkdownRenderer.tsx',
    '^../components/MarkdownRenderer$': '<rootDir>/src/__mocks__/blog/components/MarkdownRenderer.tsx',
    '^../../blog/components/RichTextRenderer$': '<rootDir>/src/__mocks__/blog/components/RichTextRenderer.tsx',
    '^../components/RichTextRenderer$': '<rootDir>/src/__mocks__/blog/components/RichTextRenderer.tsx',
    '^../../blog/components/HTMLRenderer$': '<rootDir>/src/__mocks__/blog/components/HTMLRenderer.tsx',
    '^../components/HTMLRenderer$': '<rootDir>/src/__mocks__/blog/components/HTMLRenderer.tsx',
    '^../../blog/components/TableOfContents$': '<rootDir>/src/__mocks__/blog/components/TableOfContents.tsx',
    '^../components/TableOfContents$': '<rootDir>/src/__mocks__/blog/components/TableOfContents.tsx',
    '^../../blog/components/RelatedPosts$': '<rootDir>/src/__mocks__/blog/components/RelatedPosts.tsx',
    '^../components/RelatedPosts$': '<rootDir>/src/__mocks__/blog/components/RelatedPosts.tsx',
    '^../../blog/components/social/SocialShare$': '<rootDir>/src/__mocks__/blog/components/social/SocialShare.tsx',
    '^../components/social/SocialShare$': '<rootDir>/src/__mocks__/blog/components/social/SocialShare.tsx',
    '^../../blog/context/FilterContext$': '<rootDir>/src/__mocks__/blog/context/FilterContext.tsx',
    '^../blog/context/FilterContext$': '<rootDir>/src/__mocks__/blog/context/FilterContext.tsx',
    '^../../../blog/context/FilterContext$': '<rootDir>/src/__mocks__/blog/context/FilterContext.tsx',
    '^../../blog/hooks/useFilterPersistence$': '<rootDir>/src/__mocks__/blog/hooks/useFilterPersistence.ts',
    '^../blog/hooks/useFilterPersistence$': '<rootDir>/src/__mocks__/blog/hooks/useFilterPersistence.ts',
    '^../../../blog/hooks/useFilterPersistence$': '<rootDir>/src/__mocks__/blog/hooks/useFilterPersistence.ts',
    '^../../blog/hooks/useSearchHistory$': '<rootDir>/src/__mocks__/blog/hooks/useSearchHistory.ts',
    '^../blog/hooks/useSearchHistory$': '<rootDir>/src/__mocks__/blog/hooks/useSearchHistory.ts',
    '^../../../blog/hooks/useSearchHistory$': '<rootDir>/src/__mocks__/blog/hooks/useSearchHistory.ts',
    '^../../blog/hooks/useSearchSuggestions$': '<rootDir>/src/__mocks__/blog/hooks/useSearchSuggestions.ts',
    '^../blog/hooks/useSearchSuggestions$': '<rootDir>/src/__mocks__/blog/hooks/useSearchSuggestions.ts',
    '^../../../blog/hooks/useSearchSuggestions$': '<rootDir>/src/__mocks__/blog/hooks/useSearchSuggestions.ts',
    '^../../blog/components/search/SearchSuggestions$': '<rootDir>/src/__mocks__/blog/components/search/SearchSuggestions.tsx',
    '^../blog/components/search/SearchSuggestions$': '<rootDir>/src/__mocks__/blog/components/search/SearchSuggestions.tsx',
    '^../../../blog/components/search/SearchSuggestions$': '<rootDir>/src/__mocks__/blog/components/search/SearchSuggestions.tsx',
    '^../../blog/components/search/SearchHistory$': '<rootDir>/src/__mocks__/blog/components/search/SearchHistory.tsx',
    '^../blog/components/search/SearchHistory$': '<rootDir>/src/__mocks__/blog/components/search/SearchHistory.tsx',
    '^../../../blog/components/search/SearchHistory$': '<rootDir>/src/__mocks__/blog/components/search/SearchHistory.tsx',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true,
      diagnostics: {
        ignoreCodes: [1343]
      },
      astTransformers: {
        before: [],
        after: []
      },
      useESM: true
    }]
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '\\.pnp\\.[^\\/]+$'
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true,
      diagnostics: false,
      useESM: true
    },
    'import.meta': {
      env: {
        VITE_CONTENTFUL_SPACE_ID: 'test-space-id',
        VITE_CONTENTFUL_ACCESS_TOKEN: 'test-access-token',
        VITE_CONTENTFUL_PREVIEW_TOKEN: 'test-preview-token',
        VITE_CONTENTFUL_ENVIRONMENT: 'test',
        VITE_CONTENTFUL_PREVIEW_MODE: 'false',
        VITE_CONTENTFUL_CACHE_TTL: '300',
        VITE_CONTENTFUL_DEFAULT_LOCALE: 'en-US',
        VITE_PEXELS_API_KEY: 'test-pexels-key',
        VITE_PEXELS_CACHE_TTL: '3600',
        VITE_PEXELS_DEFAULT_PER_PAGE: '15',
        VITE_PEXELS_ENABLE_FALLBACKS: 'true',
        MODE: 'test',
        DEV: true
      }
    }
  },
  verbose: true,
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  }
}; 