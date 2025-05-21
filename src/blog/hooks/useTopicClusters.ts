import { useState, useEffect } from 'react';
import { BlogPost } from '../../models/Blog';
import { usePostsQuery } from './useBlogQuery';

export interface TopicCluster {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  posts: BlogPost[];
  mainPostId?: string;
}

export interface LearningPath {
  id: string;
  name: string;
  slug: string;
  description?: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  estimatedTimeMinutes: number;
  icon?: string;
  steps: LearningPathStep[];
  completedSteps?: string[]; // IDs of completed steps
  tags?: string[];
}

export interface LearningPathStep {
  id: string;
  title: string;
  description?: string;
  postId: string;
  order: number;
  estimatedTimeMinutes?: number;
  isRequired?: boolean;
  post?: BlogPost;
}

export interface TopicClusterOptions {
  topicSlug?: string;
  limit?: number;
  postId?: string; // Get clusters relevant to this post
  includePosts?: boolean;
}

export interface LearningPathOptions {
  pathSlug?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  tag?: string;
  limit?: number;
  includePosts?: boolean;
}

export function useTopicClusters(options: TopicClusterOptions = {}) {
  const [clusters, setClusters] = useState<TopicCluster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { data: allPosts, isLoading: postsLoading } = usePostsQuery({});
  
  useEffect(() => {
    const fetchClusters = async () => {
      try {
        // In a real app, this would be an API call or a more complex query
        // Here we'll simulate a data structure that mimics topic clusters
        
        // Wait for posts to be loaded
        if (postsLoading || !allPosts) {
          return;
        }
        
        // Simulate server response with mock data based on the loaded posts
        setTimeout(() => {
          // Group posts by category to create "clusters"
          const postsByCategory: Record<string, BlogPost[]> = {};
          
          allPosts.forEach(post => {
            if (post.category) {
              if (!postsByCategory[post.category]) {
                postsByCategory[post.category] = [];
              }
              postsByCategory[post.category].push(post);
            }
          });
          
          // Transform into topic clusters
          const mockClusters: TopicCluster[] = Object.entries(postsByCategory).map(([category, posts]) => {
            // Only include featured or important posts as main posts
            const mainPost = posts.find(post => post.featured);
            const mainPostId = mainPost?.id;
            
            // Create a slug from the category
            const slug = category.toLowerCase().replace(/\s+/g, '-');
            
            return {
              id: `cluster-${slug}`,
              name: category,
              slug,
              description: `Articles about ${category}`,
              posts: options.includePosts ? posts : [],
              mainPostId
            };
          });
          
          // Apply filters based on options
          let filteredClusters = [...mockClusters];
          
          // Filter by topic slug
          if (options.topicSlug) {
            filteredClusters = filteredClusters.filter(
              cluster => cluster.slug === options.topicSlug
            );
          }
          
          // Filter clusters relevant to a specific post
          if (options.postId) {
            const postCategories = allPosts
              .filter(post => post.id === options.postId)
              .map(post => post.category);
              
            if (postCategories.length > 0) {
              filteredClusters = filteredClusters.filter(
                cluster => postCategories.includes(cluster.name)
              );
              
              // Also find clusters with similar tags
              const postTags = allPosts
                .filter(post => post.id === options.postId)
                .flatMap(post => post.tags || []);
                
              if (postTags.length > 0) {
                const relatedClusters = mockClusters.filter(cluster => {
                  // Check if cluster contains posts with similar tags
                  const clusterPosts = allPosts.filter(post => post.category === cluster.name);
                  const clusterTags = new Set(clusterPosts.flatMap(post => post.tags || []));
                  
                  return postTags.some(tag => clusterTags.has(tag));
                });
                
                // Add related clusters not already included
                relatedClusters.forEach(cluster => {
                  if (!filteredClusters.some(c => c.id === cluster.id)) {
                    filteredClusters.push(cluster);
                  }
                });
              }
            }
          }
          
          // Apply limit
          if (options.limit && options.limit > 0) {
            filteredClusters = filteredClusters.slice(0, options.limit);
          }
          
          setClusters(filteredClusters);
          setIsLoading(false);
        }, 500); // Simulate network delay
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch topic clusters'));
        setIsLoading(false);
      }
    };
    
    fetchClusters();
  }, [options.topicSlug, options.limit, options.postId, options.includePosts, allPosts, postsLoading]);
  
  return { clusters, isLoading, error };
}

export function useLearningPaths(options: LearningPathOptions = {}) {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { data: allPosts, isLoading: postsLoading } = usePostsQuery({});
  
  useEffect(() => {
    const fetchPaths = async () => {
      try {
        // In a real app, this would be an API call or a more complex query
        // Here we'll simulate a data structure that mimics learning paths
        
        // Wait for posts to be loaded
        if (postsLoading || !allPosts) {
          return;
        }
        
        // Simulate server response with mock data based on the loaded posts
        setTimeout(() => {
          // Group posts by tags to create "learning paths"
          const postsByTag: Record<string, BlogPost[]> = {};
          
          allPosts.forEach(post => {
            if (post.tags && post.tags.length > 0) {
              post.tags.forEach(tag => {
                if (!postsByTag[tag]) {
                  postsByTag[tag] = [];
                }
                postsByTag[tag].push(post);
              });
            }
          });
          
          // Transform into learning paths
          const mockPaths: LearningPath[] = Object.entries(postsByTag)
            .filter(([_, posts]) => posts.length >= 3) // Only create paths with enough content
            .map(([tag, posts]) => {
              // Sort posts by publishDate to create a natural sequence
              const sortedPosts = [...posts].sort(
                (a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
              );
              
              // Create a slug from the tag
              const slug = tag.toLowerCase().replace(/\s+/g, '-');
              
              // Determine difficulty level based on content complexity
              // (in a real app, this would be stored metadata)
              const randomLevel = Math.floor(Math.random() * 3);
              const level = randomLevel === 0 ? 'beginner' : 
                         randomLevel === 1 ? 'intermediate' : 'advanced';
              
              // Calculate total time
              const totalMinutes = sortedPosts.reduce(
                (sum, post) => sum + (post.readTime || 5), 
                0
              );
              
              // Create learning path steps
              const steps: LearningPathStep[] = sortedPosts.slice(0, 5).map((post, index) => ({
                id: `step-${post.id}`,
                title: post.title,
                description: post.excerpt,
                postId: post.id,
                order: index + 1,
                estimatedTimeMinutes: post.readTime || 5,
                isRequired: index < 2, // First two steps are required
                post: options.includePosts ? post : undefined
              }));
              
              return {
                id: `path-${slug}`,
                name: `Learn ${tag}`,
                slug,
                description: `Master ${tag} with this curated learning path.`,
                level: level as 'beginner' | 'intermediate' | 'advanced',
                estimatedTimeMinutes: totalMinutes,
                steps,
                tags: [tag]
              };
            });
          
          // Apply filters based on options
          let filteredPaths = [...mockPaths];
          
          // Filter by path slug
          if (options.pathSlug) {
            filteredPaths = filteredPaths.filter(
              path => path.slug === options.pathSlug
            );
          }
          
          // Filter by difficulty level
          if (options.level) {
            filteredPaths = filteredPaths.filter(
              path => path.level === options.level || path.level === 'all'
            );
          }
          
          // Filter by tag
          if (options.tag) {
            filteredPaths = filteredPaths.filter(
              path => path.tags?.includes(options.tag!)
            );
          }
          
          // Apply limit
          if (options.limit && options.limit > 0) {
            filteredPaths = filteredPaths.slice(0, options.limit);
          }
          
          setPaths(filteredPaths);
          setIsLoading(false);
        }, 500); // Simulate network delay
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch learning paths'));
        setIsLoading(false);
      }
    };
    
    fetchPaths();
  }, [
    options.pathSlug, 
    options.level, 
    options.tag, 
    options.limit, 
    options.includePosts, 
    allPosts, 
    postsLoading
  ]);
  
  return { paths, isLoading, error };
}

export function usePathProgress(pathId: string) {
  // This would typically be stored in a database or local storage
  // Here we're just simulating with state
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading progress data
    setTimeout(() => {
      // In a real app, you'd load this from localStorage or an API
      const savedProgress = localStorage.getItem(`path-progress-${pathId}`);
      if (savedProgress) {
        setCompletedSteps(JSON.parse(savedProgress));
      }
      setIsLoading(false);
    }, 300);
  }, [pathId]);
  
  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => {
      const updated = [...prev, stepId];
      // In a real app, save to localStorage or an API
      localStorage.setItem(`path-progress-${pathId}`, JSON.stringify(updated));
      return updated;
    });
  };
  
  const markStepIncomplete = (stepId: string) => {
    setCompletedSteps(prev => {
      const updated = prev.filter(id => id !== stepId);
      // In a real app, save to localStorage or an API
      localStorage.setItem(`path-progress-${pathId}`, JSON.stringify(updated));
      return updated;
    });
  };
  
  const resetProgress = () => {
    setCompletedSteps([]);
    // In a real app, remove from localStorage or call an API
    localStorage.removeItem(`path-progress-${pathId}`);
  };
  
  return {
    completedSteps,
    isLoading,
    markStepComplete,
    markStepIncomplete,
    resetProgress,
    progress: isLoading ? 0 : completedSteps.length,
  };
}

export function useRecommendedContent(postId?: string, userId?: string) {
  const [recommendations, setRecommendations] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { data: allPosts, isLoading: postsLoading } = usePostsQuery({});
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Wait for posts to be loaded
        if (postsLoading || !allPosts) {
          return;
        }
        
        // Simulate server response 
        setTimeout(() => {
          // In a real app, this would be a sophisticated recommendation algorithm
          // Here we're just matching on the most similar tags
          
          let recommended: BlogPost[] = [];
          
          if (postId) {
            // Content-based recommendations
            const currentPost = allPosts.find(post => post.id === postId);
            if (currentPost && currentPost.tags && currentPost.tags.length > 0) {
              // Find posts with similar tags, excluding the current post
              const similarPosts = allPosts
                .filter(post => post.id !== postId)
                .map(post => ({
                  post,
                  // Calculate a similarity score based on tag overlap
                  score: post.tags
                    ? post.tags.filter(tag => 
                        currentPost.tags?.includes(tag)
                      ).length
                    : 0
                }))
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(item => item.post);
              
              recommended = similarPosts.slice(0, 5);
            }
          } else if (userId) {
            // Personalized recommendations based on user
            // In a real app, this would use a user's reading history, preferences, etc.
            
            // Simulate by selecting a random set of featured or recent posts
            const featuredPosts = allPosts.filter(post => post.featured);
            const recentPosts = [...allPosts]
              .sort((a, b) => 
                new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
              )
              .slice(0, 10);
            
            // Mix featured and recent
            const candidatePosts = [...featuredPosts, ...recentPosts];
            
            // Remove duplicates
            const uniquePosts = candidatePosts.filter(
              (post, index, self) => 
                index === self.findIndex(p => p.id === post.id)
            );
            
            recommended = uniquePosts.slice(0, 5);
          } else {
            // Default recommendations - most popular or featured
            recommended = allPosts
              .filter(post => post.featured)
              .slice(0, 5);
          }
          
          setRecommendations(recommended);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'));
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [postId, userId, allPosts, postsLoading]);
  
  return { recommendations, isLoading, error };
} 