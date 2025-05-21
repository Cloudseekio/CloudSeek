import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Folder, BookOpen } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTopicClusters, TopicCluster } from '../hooks/useTopicClusters';

type TopicClusterVariant = 
  | 'grid'     // Grid of topic clusters
  | 'cards'    // Card style for each topic
  | 'list'     // Simple list of topics
  | 'featured' // More prominent display for main topics
  | 'sidebar'  // Compact version for sidebars
  | 'minimal'  // Very minimal display

interface TopicClustersProps {
  title?: string;
  description?: string;
  topicSlug?: string;
  limit?: number;
  postId?: string;
  variant?: TopicClusterVariant;
  showHeading?: boolean;
  showDescription?: boolean;
  showPostCount?: boolean;
  showViewAll?: boolean;
  viewAllUrl?: string;
  viewAllLabel?: string;
  className?: string;
  onTopicClick?: (topicSlug: string) => void;
}

const TopicClusters: React.FC<TopicClustersProps> = ({
  title = 'Topic Clusters',
  description,
  topicSlug,
  limit = 4,
  postId,
  variant = 'grid',
  showHeading = true,
  showDescription = true,
  showPostCount = true,
  showViewAll = true,
  viewAllUrl = '/blog/topics',
  viewAllLabel = 'View all topics',
  className = '',
  onTopicClick
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  
  // Fetch topic clusters using the hook
  const { clusters, isLoading, error } = useTopicClusters({
    topicSlug,
    limit,
    postId,
    includePosts: true
  });

  const toggleCluster = (clusterId: string) => {
    setExpandedCluster(expandedCluster === clusterId ? null : clusterId);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 w-1/3 mb-4 rounded"></div>
        {variant === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg h-48"></div>
            ))}
          </div>
        )}
        {variant === 'list' && (
          <div className="space-y-3">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={`${className} text-red-500 dark:text-red-400 p-4 rounded-lg bg-red-50 dark:bg-red-900/20`}>
        <p>Error loading topic clusters: {error.message}</p>
      </div>
    );
  }

  // If no clusters found
  if (!clusters || clusters.length === 0) {
    return (
      <div className={`${className} text-gray-500 dark:text-gray-400 p-4 rounded-lg bg-gray-50 dark:bg-gray-800`}>
        <p>No topic clusters found.</p>
      </div>
    );
  }

  const renderCluster = (cluster: TopicCluster) => {
    const isExpanded = expandedCluster === cluster.id;
    const postsToShow = isExpanded ? cluster.posts : cluster.posts.slice(0, 3);
    
    switch (variant) {
      case 'cards':
        return (
          <div key={cluster.id} className={`rounded-lg p-5 transition-colors ${
            isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50 shadow-sm'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'
              }`}>
                {cluster.icon ? (
                  <span className="text-lg">{cluster.icon}</span>
                ) : (
                  <Folder size={20} />
                )}
              </div>
              <h3 className="text-lg font-semibold flex-1">
                <Link 
                  to={`/blog/topics/${cluster.slug}`}
                  className={isDark ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'}
                  onClick={() => onTopicClick?.(cluster.slug)}
                >
                  {cluster.name}
                </Link>
              </h3>
              {showPostCount && (
                <span className={`text-sm px-2 py-1 rounded ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {cluster.posts.length} posts
                </span>
              )}
            </div>
            
            {showDescription && cluster.description && (
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {cluster.description}
              </p>
            )}
            
            <div className="space-y-2">
              {postsToShow.map(post => (
                <div key={post.id} className={`text-sm py-1 px-2 rounded ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className={`flex items-center ${
                      isDark ? 'text-gray-300 hover:text-blue-300' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    <ChevronRight size={16} className="mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{post.title}</span>
                  </Link>
                </div>
              ))}
            </div>
            
            {cluster.posts.length > 3 && (
              <button
                className={`mt-3 text-sm flex items-center ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                }`}
                onClick={() => toggleCluster(cluster.id)}
                aria-expanded={isExpanded ? 'true' : 'false'}
              >
                {isExpanded ? 'Show less' : `View all ${cluster.posts.length} posts`}
              </button>
            )}
          </div>
        );
      
      case 'list':
        return (
          <div key={cluster.id} className={`border-b last:border-b-0 py-3 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'
              }`}>
                {cluster.icon ? (
                  <span>{cluster.icon}</span>
                ) : (
                  <Folder size={16} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-0.5">
                  <Link 
                    to={`/blog/topics/${cluster.slug}`} 
                    className={isDark ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'}
                    onClick={() => onTopicClick?.(cluster.slug)}
                  >
                    {cluster.name}
                  </Link>
                </h3>
                {showDescription && cluster.description && (
                  <p className={`text-sm line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {cluster.description}
                  </p>
                )}
              </div>
              {showPostCount && (
                <span className={`text-xs px-2 py-1 rounded ${
                  isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {cluster.posts.length}
                </span>
              )}
              <ChevronRight 
                size={18} 
                className={`ml-2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} 
              />
            </div>
          </div>
        );
        
      case 'featured':
        return (
          <div 
            key={cluster.id} 
            className={`rounded-lg overflow-hidden ${
              isDark ? 'bg-gray-800' : 'bg-white shadow-md'
            }`}
          >
            <div className={`p-5 ${
              isDark ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-200 text-blue-700'
                }`}>
                  {cluster.icon ? (
                    <span className="text-lg">{cluster.icon}</span>
                  ) : (
                    <Folder size={20} />
                  )}
                </div>
                <h3 className="text-xl font-bold">
                  <Link 
                    to={`/blog/topics/${cluster.slug}`}
                    className={isDark ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'}
                    onClick={() => onTopicClick?.(cluster.slug)}
                  >
                    {cluster.name}
                  </Link>
                </h3>
              </div>
              
              {showDescription && cluster.description && (
                <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {cluster.description}
                </p>
              )}
            </div>
            
            <div className="p-5">
              <div className="space-y-4">
                {cluster.posts.slice(0, 4).map(post => (
                  <div key={post.id} className="flex items-start gap-3">
                    <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <BookOpen size={14} />
                    </div>
                    <div>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className={`font-medium line-clamp-1 ${
                          isDark ? 'text-gray-200 hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'
                        }`}
                      >
                        {post.title}
                      </Link>
                      <p className={`text-sm line-clamp-1 mt-0.5 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {post.excerpt.slice(0, 80)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {cluster.posts.length > 4 && (
                <Link 
                  to={`/blog/topics/${cluster.slug}`}
                  className={`mt-4 text-sm flex items-center ${
                    isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                  }`}
                  onClick={() => onTopicClick?.(cluster.slug)}
                >
                  View all {cluster.posts.length} posts
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              )}
            </div>
          </div>
        );
      
      case 'sidebar':
        return (
          <div key={cluster.id} className={`mb-3 ${className}`}>
            <h4 className={`font-medium flex items-center ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>
              <Folder size={16} className="mr-2" />
              <Link 
                to={`/blog/topics/${cluster.slug}`}
                className={isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'}
                onClick={() => onTopicClick?.(cluster.slug)}
              >
                {cluster.name}
              </Link>
              {showPostCount && (
                <span className={`ml-2 text-xs py-0.5 px-1.5 rounded ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {cluster.posts.length}
                </span>
              )}
            </h4>
            
            <ul className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {cluster.posts.slice(0, 3).map(post => (
                <li key={post.id} className="ml-6 mt-1 list-disc">
                  <Link 
                    to={`/blog/${post.slug}`}
                    className={`hover:underline line-clamp-1 ${
                      isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'
                    }`}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      
      case 'minimal':
        return (
          <div key={cluster.id} className="mb-2 last:mb-0">
            <Link 
              to={`/blog/topics/${cluster.slug}`}
              className={`text-sm font-medium flex items-center ${
                isDark ? 'text-gray-200 hover:text-blue-300' : 'text-gray-700 hover:text-blue-600'
              }`}
              onClick={() => onTopicClick?.(cluster.slug)}
            >
              <ChevronRight size={16} className="mr-1" />
              {cluster.name}
              {showPostCount && (
                <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  ({cluster.posts.length})
                </span>
              )}
            </Link>
          </div>
        );
                
      case 'grid':
      default:
        return (
          <div 
            key={cluster.id} 
            className={`rounded-lg overflow-hidden ${
              isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50 shadow-sm'
            }`}
          >
            <div className="p-4">
              <div className="flex items-center mb-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 ${
                  isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'
                }`}>
                  {cluster.icon ? (
                    <span>{cluster.icon}</span>
                  ) : (
                    <Folder size={18} />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">
                    <Link 
                      to={`/blog/topics/${cluster.slug}`} 
                      className={isDark ? 'text-white hover:text-blue-300' : 'text-gray-800 hover:text-blue-600'}
                      onClick={() => onTopicClick?.(cluster.slug)}
                    >
                      {cluster.name}
                    </Link>
                  </h3>
                  {showPostCount && (
                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {cluster.posts.length} {cluster.posts.length === 1 ? 'post' : 'posts'}
                    </div>
                  )}
                </div>
              </div>
              
              {showDescription && cluster.description && (
                <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {cluster.description}
                </p>
              )}
              
              {cluster.posts.length > 0 && (
                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {cluster.posts.slice(0, 3).map(post => (
                    <li key={post.id} className="flex">
                      <ChevronRight size={16} className={`mr-1 mt-1 flex-shrink-0 ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className={`line-clamp-1 ${
                          isDark ? 'hover:text-blue-300' : 'hover:text-blue-600'
                        }`}
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className={`px-4 py-2 border-t ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <Link
                to={`/blog/topics/${cluster.slug}`}
                className={`text-sm flex items-center ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                }`}
                onClick={() => onTopicClick?.(cluster.slug)}
              >
                View all posts
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {showHeading && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {title}
            </h2>
            
            {showViewAll && (
              <Link 
                to={viewAllUrl}
                className={`text-sm flex items-center ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                {viewAllLabel}
                <ChevronRight size={16} className="ml-1" />
              </Link>
            )}
          </div>
          
          {description && (
            <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {description}
            </p>
          )}
        </div>
      )}
      
      {/* Grid layout */}
      {variant === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clusters.map(renderCluster)}
        </div>
      )}
      
      {/* Featured layout */}
      {variant === 'featured' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clusters.map(renderCluster)}
        </div>
      )}
      
      {/* Cards layout */}
      {variant === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clusters.map(renderCluster)}
        </div>
      )}
      
      {/* List layout */}
      {variant === 'list' && (
        <div className={`rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
          {clusters.map(renderCluster)}
        </div>
      )}
      
      {/* Sidebar and minimal layouts */}
      {(variant === 'sidebar' || variant === 'minimal') && (
        <div className="space-y-1">
          {clusters.map(renderCluster)}
        </div>
      )}
    </div>
  );
};

export default TopicClusters; 