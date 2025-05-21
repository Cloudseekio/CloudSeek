import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { BlogPost, BlogCategory } from '../models/Blog';
import { useBlogData } from '../blog/hooks/useBlogData';

// Define the state structure
interface BlogState {
  posts: BlogPost[];
  categories: BlogCategory[];
  tags: string[];
  featuredPosts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  selectedTag: string;
  filteredPosts: BlogPost[];
}

// Define action types
type BlogAction =
  | { type: 'SET_POSTS'; payload: BlogPost[] }
  | { type: 'SET_CATEGORIES'; payload: BlogCategory[] }
  | { type: 'SET_TAGS'; payload: string[] }
  | { type: 'SET_FEATURED_POSTS'; payload: BlogPost[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'SET_SELECTED_TAG'; payload: string }
  | { type: 'SET_FILTERED_POSTS'; payload: BlogPost[] };

// Define the context interface
interface BlogContextValue {
  state: BlogState;
  dispatch: React.Dispatch<BlogAction>;
  searchPosts: (query: string) => void;
  filterPostsByCategory: (category: string) => void;
  filterPostsByTag: (tag: string) => void;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  getRelatedPosts: (post: BlogPost) => BlogPost[];
}

// Create the context
const BlogContext = createContext<BlogContextValue | undefined>(undefined);

// Initial state
const initialState: BlogState = {
  posts: [],
  categories: [],
  tags: [],
  featuredPosts: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
  selectedTag: '',
  filteredPosts: []
};

// Reducer function
const blogReducer = (state: BlogState, action: BlogAction): BlogState => {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload, filteredPosts: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_TAGS':
      return { ...state, tags: action.payload };
    case 'SET_FEATURED_POSTS':
      return { ...state, featuredPosts: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_SELECTED_TAG':
      return { ...state, selectedTag: action.payload };
    case 'SET_FILTERED_POSTS':
      return { ...state, filteredPosts: action.payload };
    default:
      return state;
  }
};

// Provider component
export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, initialState);
  
  // Use our new blog data hook
  const blogData = useBlogData();
  
  // Load initial data when component mounts
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Fetch all the initial data
        const posts = await blogData.fetchPosts();
        const categories = await blogData.fetchCategories();
        const tags = await blogData.fetchTags();
        const featuredPosts = await blogData.fetchFeaturedPosts();
        
        // Update the state with fetched data
        dispatch({ type: 'SET_POSTS', payload: posts });
        dispatch({ type: 'SET_CATEGORIES', payload: categories });
        dispatch({ type: 'SET_TAGS', payload: tags });
        dispatch({ type: 'SET_FEATURED_POSTS', payload: featuredPosts });
        dispatch({ type: 'SET_FILTERED_POSTS', payload: posts });
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'An unknown error occurred' 
        });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);
  
  // Search posts
  const searchPosts = async (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    
    if (!query.trim()) {
      // If query is empty, reset to filtered by category/tag
      if (state.selectedCategory !== 'all') {
        const posts = await blogData.fetchPostsByCategory(state.selectedCategory);
        dispatch({ type: 'SET_FILTERED_POSTS', payload: posts });
      } else if (state.selectedTag) {
        const posts = await blogData.fetchPostsByTag(state.selectedTag);
        dispatch({ type: 'SET_FILTERED_POSTS', payload: posts });
      } else {
        dispatch({ type: 'SET_FILTERED_POSTS', payload: state.posts });
      }
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const posts = await blogData.searchPosts(query);
      
      // Apply category filter if one is selected
      let filteredPosts = posts;
      if (state.selectedCategory !== 'all') {
        filteredPosts = posts.filter(post => 
          post.category.toLowerCase() === state.selectedCategory.toLowerCase()
        );
      }
      
      // Apply tag filter if one is selected
      if (state.selectedTag) {
        filteredPosts = filteredPosts.filter(post => 
          post.tags.some(tag => tag.toLowerCase() === state.selectedTag.toLowerCase())
        );
      }
      
      dispatch({ type: 'SET_FILTERED_POSTS', payload: filteredPosts });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to search posts' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Filter posts by category
  const filterPostsByCategory = async (category: string) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      let posts;
      if (category === 'all') {
        posts = state.posts;
      } else {
        posts = await blogData.fetchPostsByCategory(category);
      }
      
      // Apply search query if one exists
      let filteredPosts = posts;
      if (state.searchQuery) {
        filteredPosts = posts.filter(post => 
          post.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }
      
      // Apply tag filter if one is selected
      if (state.selectedTag) {
        filteredPosts = filteredPosts.filter(post => 
          post.tags.some(tag => tag.toLowerCase() === state.selectedTag.toLowerCase())
        );
      }
      
      dispatch({ type: 'SET_FILTERED_POSTS', payload: filteredPosts });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to filter posts by category' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Filter posts by tag
  const filterPostsByTag = async (tag: string) => {
    dispatch({ type: 'SET_SELECTED_TAG', payload: tag });
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      let posts;
      if (!tag) {
        // If no tag is selected, use all posts or category-filtered posts
        if (state.selectedCategory === 'all') {
          posts = state.posts;
        } else {
          posts = await blogData.fetchPostsByCategory(state.selectedCategory);
        }
      } else {
        posts = await blogData.fetchPostsByTag(tag);
        
        // Apply category filter if one is selected
        if (state.selectedCategory !== 'all') {
          posts = posts.filter(post => 
            post.category.toLowerCase() === state.selectedCategory.toLowerCase()
          );
        }
      }
      
      // Apply search query if one exists
      if (state.searchQuery) {
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }
      
      dispatch({ type: 'SET_FILTERED_POSTS', payload: posts });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to filter posts by tag' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  // Get a post by slug
  const getPostBySlug = (slug: string): BlogPost | undefined => {
    return state.posts.find(post => post.slug === slug);
  };
  
  // Get related posts
  const getRelatedPosts = (post: BlogPost): BlogPost[] => {
    return state.posts
      .filter(p => p.id !== post.id)
      .filter(p => 
        p.category === post.category || 
        p.tags.some(tag => post.tags.includes(tag))
      )
      .slice(0, 3);
  };

  const value = {
    state,
    dispatch,
    searchPosts,
    filterPostsByCategory,
    filterPostsByTag,
    getPostBySlug,
    getRelatedPosts
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};

// Create custom hook to use the blog context
export const useBlog = (): BlogContextValue => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}; 