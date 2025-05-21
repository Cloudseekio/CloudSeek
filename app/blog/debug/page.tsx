'use client';

import React, { useEffect } from 'react';
import DebugPage from '../../../src/blog/pages/DebugPage';
import logger from '../../../src/utils/logger';

export default function BlogDebugPage() {
  useEffect(() => {
    // Log environment information to help with debugging
    logger.info('Blog Debug Page: Environment Information', {
      contentfulConfig: {
        spaceId: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
        environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT,
        hasAccessToken: !!import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
        hasPreviewToken: !!import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN,
      },
      supportedContentTypes: ['blogpost']
    });
  }, []);

  return <DebugPage />;
} 