import { useState, useEffect } from 'react';
import { BlogPost } from '../../models/Blog';

interface OfflineContent {
  posts: BlogPost[];
  lastSynced: string;
}

interface UseOfflineContentReturn {
  savedPosts: BlogPost[];
  isSyncing: boolean;
  savePost: (post: BlogPost) => Promise<void>;
  removePost: (postId: string) => Promise<void>;
  syncContent: () => Promise<void>;
  lastSyncTime: string | null;
}

const STORAGE_KEY = 'offline_content';

export function useOfflineContent(): UseOfflineContentReturn {
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Load saved content on mount
  useEffect(() => {
    const loadSavedContent = () => {
      try {
        const savedContent = localStorage.getItem(STORAGE_KEY);
        if (savedContent) {
          const { posts, lastSynced } = JSON.parse(savedContent) as OfflineContent;
          setSavedPosts(posts);
          setLastSyncTime(lastSynced);
        }
      } catch (error) {
        console.error('Error loading saved content:', error);
      }
    };

    loadSavedContent();
  }, []);

  // Save content to storage whenever it changes
  useEffect(() => {
    const saveContent = () => {
      try {
        const content: OfflineContent = {
          posts: savedPosts,
          lastSynced: lastSyncTime || new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      } catch (error) {
        console.error('Error saving content:', error);
      }
    };

    if (savedPosts.length > 0) {
      saveContent();
    }
  }, [savedPosts, lastSyncTime]);

  const savePost = async (post: BlogPost): Promise<void> => {
    try {
      // Check if post already exists
      const exists = savedPosts.some(p => p.id === post.id);
      if (!exists) {
        setSavedPosts(prev => [...prev, post]);
      }
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  };

  const removePost = async (postId: string): Promise<void> => {
    try {
      setSavedPosts(prev => prev.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Error removing post:', error);
      throw error;
    }
  };

  const syncContent = async (): Promise<void> => {
    if (isSyncing) return;

    try {
      setIsSyncing(true);

      // In a real implementation, you would:
      // 1. Check for new content on the server
      // 2. Download new content
      // 3. Update local storage
      // 4. Handle conflicts

      // For now, just update the sync time
      const newSyncTime = new Date().toISOString();
      setLastSyncTime(newSyncTime);
    } catch (error) {
      console.error('Error syncing content:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    savedPosts,
    isSyncing,
    savePost,
    removePost,
    syncContent,
    lastSyncTime
  };
} 