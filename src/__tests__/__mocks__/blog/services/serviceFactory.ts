// Mock service factory for testing
export const createContentfulClient = jest.fn().mockReturnValue({
  // Mock contentful client methods as needed
});

export const getContentfulConfig = jest.fn().mockReturnValue({
  spaceId: 'mock-space-id',
  accessToken: 'mock-access-token',
  environment: 'mock-environment',
  previewAccessToken: 'mock-preview-token',
  previewMode: false
}); 