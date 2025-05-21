'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BlogPost, BlogCategory, BlogTag } from '../types/blog';
import { getBlogService, initializeServices } from '../services/serviceFactory';
import { useContentfulConnection } from './useContentfulConnection';
import { usePerformanceMonitoring } from '../../utils/performance';
import logger from '../../utils/logger';

export function useBlog() {
  const { status: connectionStatus } = useContentfulConnection();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Performance monitoring
  const { measureAction } = usePerformanceMonitoring('useBlog');
  
  // Refs for tracking mounted state and abort controller
  const isMounted = useRef(true);
  const abortController = useRef<AbortController | null>(null);
  const initializationAttempted = useRef(false);
  const initializationInProgress = useRef(false);

  // Safe setState functions that check if component is mounted
  const safeSetState = useCallback(<T>(setter: React.Dispatch<React.SetStateAction<T>>) => {
    return (value: T) => {
      if (isMounted.current) {
        setter(value);
      }
    };
  }, []);

  const fetchPosts = useCallback(async (signal?: AbortSignal) => {
    const endMeasure = measureAction('fetchPosts');
      try {
        logger.debug('useBlog: Fetching posts');
        const blogService = getBlogService();
        
        const response = await blogService.getPosts();
      
      if (signal?.aborted) return;
      
      safeSetState(setPosts)(response.items);
      
      // Set featured posts
      const featured = response.items.filter(post => post.featured);
      safeSetState(setFeaturedPosts)(featured);
        
        logger.info('useBlog: Successfully fetched posts', {
          total: response.total,
        featured: featured.length
        });
      
        return true;
      } catch (err) {
      if (signal?.aborted) return;
      
        const error = err instanceof Error ? err : new Error('Failed to fetch posts');
        logger.error('useBlog: Failed to fetch posts', error);
      throw error;
    } finally {
      endMeasure();
      }
  }, [safeSetState, measureAction]);

  const fetchCategories = useCallback(async (signal?: AbortSignal) => {
    const endMeasure = measureAction('fetchCategories');
      try {
        logger.debug('useBlog: Fetching categories');
        const blogService = getBlogService();
        const response = await blogService.getCategories();
      
      if (signal?.aborted) return;
      
      safeSetState(setCategories)(response.items);
        logger.info('useBlog: Successfully fetched categories', {
          total: response.total
        });
      return true;
      } catch (err) {
      if (signal?.aborted) return;
      
        const error = err instanceof Error ? err : new Error('Failed to fetch categories');
        logger.error('useBlog: Failed to fetch categories', error);
      throw error;
    } finally {
      endMeasure();
      }
  }, [safeSetState, measureAction]);

  const fetchTags = useCallback(async (signal?: AbortSignal) => {
    const endMeasure = measureAction('fetchTags');
      try {
        logger.debug('useBlog: Fetching tags');
        const blogService = getBlogService();
        const response = await blogService.getTags();
      
      if (signal?.aborted) return;
      
      safeSetState(setTags)(response.items);
        logger.info('useBlog: Successfully fetched tags', {
          total: response.total
        });
      return true;
      } catch (err) {
      if (signal?.aborted) return;
      
        const error = err instanceof Error ? err : new Error('Failed to fetch tags');
        logger.error('useBlog: Failed to fetch tags', error);
      throw error;
    } finally {
      endMeasure();
    }
  }, [safeSetState, measureAction]);

  const initializeBlog = useCallback(async (signal?: AbortSignal) => {
    // Prevent multiple initialization attempts
    if (initializationInProgress.current || initializationAttempted.current || isInitialized) {
      logger.debug('useBlog: Initialization already attempted or in progress');
      return;
    }

    initializationInProgress.current = true;
    const endMeasure = measureAction('initializeBlog');
    
      if (!connectionStatus.isConnected) {
        logger.debug('useBlog: Skipping initialization - connection not established');
      initializationInProgress.current = false;
        return;
      }

    safeSetState(setLoading)(true);
    safeSetState(setError)(null);
      
      try {
        logger.debug('useBlog: Starting blog initialization');
      
      const status = await initializeServices();
      if (!status.initialized || !status.services.contentful) {
        throw new Error('Failed to initialize services: ' + (status.error?.message || 'Unknown error'));
      }
      
      if (signal?.aborted) {
        initializationInProgress.current = false;
        return;
      }
      
      const results = await Promise.allSettled([
        fetchPosts(signal),
        fetchCategories(signal),
        fetchTags(signal)
      ]);
      
      if (signal?.aborted) {
        initializationInProgress.current = false;
        return;
      }
      
      const errors = results
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map(result => result.reason);
      
      if (errors.length > 0) {
        const postsResult = results[0];
        if (postsResult.status === 'fulfilled' && postsResult.value) {
          logger.warn('useBlog: Partial data load success - some data failed to load', { errors });
        } else {
          throw new Error('Failed to load blog data: ' + errors[0]);
        }
      }
      
      if (isMounted.current) {
        setIsInitialized(true);
        logger.info('useBlog: Blog initialization completed successfully');
      }
    } catch (err) {
      if (signal?.aborted) {
        initializationInProgress.current = false;
        return;
      }
      
        const error = err instanceof Error ? err : new Error('Failed to initialize blog');
        logger.error('useBlog: Failed to initialize blog', error);
      if (isMounted.current) {
        setError(error);
      }
      } finally {
      initializationAttempted.current = true;
      initializationInProgress.current = false;
      if (isMounted.current) {
        setLoading(false);
      }
      endMeasure();
    }
  }, [connectionStatus.isConnected, isInitialized, safeSetState, measureAction, fetchPosts, fetchCategories, fetchTags]);

  useEffect(() => {
    isMounted.current = true;
    
    // Only initialize if connection is established and not already initialized
    if (connectionStatus.isConnected && !isInitialized && !initializationAttempted.current) {
      // Set up abort controller
      abortController.current = new AbortController();
      const { signal } = abortController.current;

      initializeBlog(signal).catch(error => {
        logger.error('useBlog: Initialization failed:', error);
      });
    }
    
    return () => {
      isMounted.current = false;
      abortController.current?.abort();
    };
  }, [connectionStatus.isConnected, isInitialized, initializeBlog]);

  const getPostBySlug = useCallback(async (slug: string): Promise<BlogPost | null> => {
    const endMeasure = measureAction('getPostBySlug');
    try {
      logger.debug(`useBlog: Fetching post by slug: ${slug}`);
      const blogService = getBlogService();
      const post = await blogService.getPostBySlug(slug);
      return post;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to fetch post: ${slug}`);
      logger.error(`useBlog: Failed to fetch post by slug: ${slug}`, error);
      throw error;
    } finally {
      endMeasure();
    }
  }, [measureAction]);

  const getRelatedPosts = useCallback(async (post: BlogPost): Promise<BlogPost[]> => {
    const endMeasure = measureAction('getRelatedPosts');
    try {
      logger.debug(`useBlog: Fetching related posts for: ${post.id}`);
      const blogService = getBlogService();
      if (!blogService.getRelatedPosts) {
        logger.warn('Related posts functionality not available');
        return [];
      }
      const relatedPosts = await blogService.getRelatedPosts(post);
      return relatedPosts;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to fetch related posts for: ${post.id}`);
      logger.error(`useBlog: Failed to fetch related posts for: ${post.id}`, error);
      return [];
    } finally {
      endMeasure();
    }
  }, [measureAction]);

  return {
    posts,
    featuredPosts,
    categories,
    tags,
    loading,
    error,
    getPostBySlug,
    getRelatedPosts,
    isInitialized
  };
} 