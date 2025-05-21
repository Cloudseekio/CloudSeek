import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Filter, ChevronDown, AlertCircle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Comment } from '../../../models/Comments';
import { getComments } from '../../services/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

interface CommentsProps {
  postId: string;
  className?: string;
  highlightToCommentOn?: {
    text: string;
    position: { start: number; end: number };
  };
  allowComments?: boolean;
  showCommentCount?: boolean;
  currentUserId?: string;
  newestFirst?: boolean;
  commentsPerPage?: number;
}

const Comments: React.FC<CommentsProps> = ({
  postId,
  className = '',
  highlightToCommentOn,
  allowComments = true,
  showCommentCount = true,
  currentUserId = 'user-1', // Default user ID for demo purposes
  newestFirst = true,
  commentsPerPage = 10,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'popular'>(
    newestFirst ? 'newest' : 'oldest'
  );
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [page, setPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [highlightedCommentId] = useState<string | null>(null);
  
  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all top-level comments
      const fetchedComments = await getComments(postId);
      
      // Sort comments based on sortOrder
      const sortedComments = sortComments(fetchedComments, sortOrder);
      
      setComments(sortedComments);
      setTotalComments(
        sortedComments.reduce((count, comment) => count + 1 + (comment.replyCount || 0), 0)
      );
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [postId, sortOrder]);
  
  // Sort comments based on selected order
  const sortComments = (commentsToSort: Comment[], order: 'newest' | 'oldest' | 'popular'): Comment[] => {
    const sortedComments = [...commentsToSort];
    
    switch (order) {
      case 'newest':
        return sortedComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sortedComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'popular':
        return sortedComments.sort((a, b) => {
          // Sort by total reactions, then by reply count
          const aReactions = a.reactions.length;
          const bReactions = b.reactions.length;
          
          if (bReactions !== aReactions) {
            return bReactions - aReactions;
          }
          
          // If reactions are the same, sort by reply count
          return (b.replyCount || 0) - (a.replyCount || 0);
        });
      default:
        return sortedComments;
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);
  
  // Handle new comment submission
  const handleCommentSubmit = (newComment: Comment) => {
    setComments(prevComments => {
      // If it's a reply, we don't add it directly to the top level
      if (newComment.parentId) {
        return prevComments.map(comment => {
          if (comment.id === newComment.parentId) {
            // Increment reply count on parent
            return {
              ...comment,
              replyCount: (comment.replyCount || 0) + 1,
              // Add to replies array if it exists
              replies: comment.replies 
                ? [...comment.replies, newComment]
                : [newComment]
            };
          }
          return comment;
        });
      }
      
      // For top-level comments, add to the beginning or end based on sort order
      const updatedComments = [...prevComments];
      
      if (sortOrder === 'newest') {
        updatedComments.unshift(newComment);
      } else {
        updatedComments.push(newComment);
      }
      
      return updatedComments;
    });
    
    setTotalComments(prevCount => prevCount + 1);
    
    // Clear highlight after submission
    if (highlightToCommentOn) {
      // In a real app, you would implement this
    }
  };
  
  // Handle comment update
  const handleCommentUpdate = (updatedComment: Comment) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };
  
  // Handle comment deletion
  const handleCommentDelete = (commentId: string) => {
    setComments(prevComments => {
      // Check if it's a top-level comment
      const commentIndex = prevComments.findIndex(c => c.id === commentId);
      
      if (commentIndex !== -1) {
        // It's a top-level comment, remove it and update total count
        const deletedComment = prevComments[commentIndex];
        setTotalComments(prevCount => prevCount - 1 - (deletedComment.replyCount || 0));
        
        return prevComments.filter(c => c.id !== commentId);
      }
      
      // It's a reply, find its parent and update the reply count
      return prevComments.map(comment => {
        if (comment.replies?.some(reply => reply.id === commentId)) {
          const updatedReplies = comment.replies.filter(reply => reply.id !== commentId);
          
          setTotalComments(prevCount => prevCount - 1);
          
          return {
            ...comment,
            replies: updatedReplies,
            replyCount: (comment.replyCount || 0) - 1
          };
        }
        return comment;
      });
    });
  };
  
  // Toggle expanded state for a thread
  const toggleThread = (commentId: string) => {
    setExpandedThreads(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      
      if (newExpanded.has(commentId)) {
        newExpanded.delete(commentId);
      } else {
        newExpanded.add(commentId);
      }
      
      return newExpanded;
    });
  };
  
  // Get paginated comments for current page
  const getPaginatedComments = () => {
    const startIndex = (page - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    
    return comments.slice(startIndex, endIndex);
  };
  
  // Render loading state
  const renderLoading = () => (
    <div className={`flex flex-col items-center justify-center py-8 ${
      isDark ? 'text-gray-400' : 'text-gray-500'
    }`}>
      <div className="animate-pulse flex space-x-4 w-full max-w-2xl">
        <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-10 w-10"></div>
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
      <p className="mt-4">Loading comments...</p>
    </div>
  );
  
  // Render error state
  const renderError = () => (
    <div className={`rounded-lg p-4 my-4 flex items-start ${
      isDark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-600'
    }`}>
      <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-medium">Error loading comments</h3>
        <p className={`text-sm ${isDark ? 'text-red-300/80' : 'text-red-500'}`}>
          {error || 'Failed to load comments. Please try again later.'}
        </p>
        <button
          className={`mt-2 text-sm px-3 py-1 rounded-md ${
            isDark 
              ? 'bg-red-900/30 hover:bg-red-900/40 text-red-200' 
              : 'bg-red-100 hover:bg-red-200 text-red-700'
          }`}
          onClick={fetchComments}
        >
          Try again
        </button>
      </div>
    </div>
  );
  
  // Render empty state
  const renderEmptyState = () => (
    <div className={`text-center py-8 ${
      isDark ? 'text-gray-400' : 'text-gray-500'
    }`}>
      <MessageSquare size={40} className="mx-auto mb-3 opacity-50" />
      <h3 className={`font-medium mb-1 ${
        isDark ? 'text-gray-300' : 'text-gray-600'
      }`}>
        No comments yet
      </h3>
      <p className="text-sm mb-4">Be the first to share your thoughts!</p>
    </div>
  );
  
  // Render comment sort controls
  const renderSortControls = () => (
    <div className="relative mb-4">
      <button
        type="button"
        onClick={() => setShowSortOptions(!showSortOptions)}
        className={`flex items-center text-sm rounded-md px-3 py-1.5 ${
          isDark 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
        aria-expanded={showSortOptions ? "true" : "false"}
        aria-haspopup="true"
      >
        <Filter size={16} className="mr-1.5" />
        <span>
          {sortOrder === 'newest' 
            ? 'Newest first' 
            : sortOrder === 'oldest' 
              ? 'Oldest first' 
              : 'Most popular'}
        </span>
        <ChevronDown size={16} className="ml-1.5" />
      </button>
      
      {showSortOptions && (
        <div 
          className={`absolute top-full left-0 mt-1 z-10 rounded-md shadow-lg p-1 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setSortOrder('newest');
              setShowSortOptions(false);
            }}
            className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
              sortOrder === 'newest'
                ? isDark 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-100 text-gray-900'
                : isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            Newest first
          </button>
          <button
            type="button"
            onClick={() => {
              setSortOrder('oldest');
              setShowSortOptions(false);
            }}
            className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
              sortOrder === 'oldest'
                ? isDark 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-100 text-gray-900'
                : isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            Oldest first
          </button>
          <button
            type="button"
            onClick={() => {
              setSortOrder('popular');
              setShowSortOptions(false);
            }}
            className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
              sortOrder === 'popular'
                ? isDark 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-100 text-gray-900'
                : isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            Most popular
          </button>
        </div>
      )}
    </div>
  );
  
  // Render pagination controls
  const renderPagination = () => {
    const totalPages = Math.ceil(comments.length / commentsPerPage);
    
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center space-x-1 mt-6">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
              page === index + 1
                ? isDark 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-500 text-white'
                : isDark 
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            aria-current={page === index + 1 ? "page" : undefined}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <section id="comments" className={`mt-8 ${className}`}>
      {/* Comments header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold flex items-center ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <MessageSquare size={20} className="mr-2" />
          Comments
          {showCommentCount && totalComments > 0 && (
            <span className={`ml-2 text-sm font-normal px-2 py-0.5 rounded-full ${
              isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              {totalComments}
            </span>
          )}
        </h2>
        
        {comments.length > 0 && renderSortControls()}
      </div>
      
      {/* New comment form */}
      {allowComments && (
        <div className="mb-8">
          <CommentForm
            postId={postId}
            onSubmit={handleCommentSubmit}
            highlightText={highlightToCommentOn?.text}
            highlightPosition={highlightToCommentOn?.position}
            placeholder="Join the conversation..."
            autoFocus={!!highlightToCommentOn}
          />
        </div>
      )}
      
      {/* Comments list */}
      <div className="space-y-6">
        {isLoading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : comments.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {getPaginatedComments().map(comment => (
              <div key={comment.id} className="comment-thread">
                {/* Parent comment */}
                <CommentItem
                  comment={comment}
                  postId={postId}
                  onReplySubmitted={handleCommentSubmit}
                  onCommentUpdated={handleCommentUpdate}
                  onCommentDeleted={handleCommentDelete}
                  currentUserId={currentUserId}
                  highlightedCommentId={highlightedCommentId || undefined}
                />
                
                {/* Replies */}
                {comment.replyCount > 0 && (
                  <div className="ml-8">
                    {/* Toggle replies button */}
                    {!expandedThreads.has(comment.id) && (
                      <button
                        onClick={() => toggleThread(comment.id)}
                        className={`flex items-center text-sm mt-2 ${
                          isDark 
                            ? 'text-blue-400 hover:text-blue-300' 
                            : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        <ChevronDown size={16} className="mr-1" />
                        Show {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                      </button>
                    )}
                    
                    {/* Replies list */}
                    {expandedThreads.has(comment.id) && comment.replies && (
                      <div className="mt-4 space-y-4">
                        {comment.replies.map(reply => (
                          <CommentItem
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            onReplySubmitted={handleCommentSubmit}
                            onCommentUpdated={handleCommentUpdate}
                            onCommentDeleted={handleCommentDelete}
                            currentUserId={currentUserId}
                            highlightedCommentId={highlightedCommentId || undefined}
                          />
                        ))}
                        
                        {/* Hide replies button */}
                        <button
                          onClick={() => toggleThread(comment.id)}
                          className={`flex items-center text-sm mt-2 ${
                            isDark 
                              ? 'text-gray-400 hover:text-gray-300' 
                              : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          <ChevronDown size={16} className="mr-1 transform rotate-180" />
                          Hide replies
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {renderPagination()}
          </>
        )}
      </div>
    </section>
  );
};

export default Comments; 