import React from 'react';
import { useOfflineContent } from '../hooks/useOfflineContent';
import { Download, Trash2, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface OfflineArticlesProps {
  className?: string;
}

const OfflineArticles: React.FC<OfflineArticlesProps> = ({ className = '' }) => {
  const {
    savedPosts,
    isSyncing,
    removePost,
    syncContent,
    lastSyncTime
  } = useOfflineContent();

  const handleSync = async () => {
    try {
      await syncContent();
    } catch (error) {
      console.error('Error syncing content:', error);
    }
  };

  const handleRemove = async (postId: string) => {
    try {
      await removePost(postId);
    } catch (error) {
      console.error('Error removing post:', error);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Saved Articles
          </h2>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
        {lastSyncTime && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Last synced {formatDistanceToNow(new Date(lastSyncTime))} ago
          </p>
        )}
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {savedPosts.length === 0 ? (
          <div className="p-4 text-center text-gray-600 dark:text-gray-400">
            <Download className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No saved articles yet</p>
            <p className="text-sm mt-1">
              Save articles to read them offline
            </p>
          </div>
        ) : (
          savedPosts.map(post => (
            <div key={post.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {post.excerpt}
                  </p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formatDistanceToNow(new Date(post.publishedAt))} ago</span>
                    <span>•</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(post.id)}
                  className="ml-4 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  aria-label={`Remove ${post.title} from saved articles`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OfflineArticles; 