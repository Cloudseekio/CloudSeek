import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Reply, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  AlertCircle,
  Smile,
  Flag
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Comment, ReactionType } from '../../../models/Comments';
import { 
  addReactionToComment, 
  removeReactionFromComment, 
  updateComment,
  deleteComment 
} from '../../../services/blogService';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  postId: string; 
  onReplySubmitted: (comment: Comment) => void;
  onCommentUpdated: (comment: Comment) => void;
  onCommentDeleted: (commentId: string) => void;
  currentUserId?: string;
  highlightedCommentId?: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  onReplySubmitted,
  onCommentUpdated,
  onCommentDeleted,
  currentUserId = 'user-1', // Default user for demo purposes
  highlightedCommentId
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  
  const isHighlighted = comment.id === highlightedCommentId;
  const isCommentAuthor = comment.author.id === currentUserId;
  const isEdited = comment.isEdited;
  const isDeleted = false; // In a real app, check if comment is soft-deleted
  
  const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
  
  // Handle user's reaction to the comment
  const handleReactionClick = async (reactionType: ReactionType) => {
    try {
      const currentUserReaction = comment.reactions.find(r => r.userId === currentUserId);
      
      if (currentUserReaction && currentUserReaction.type === reactionType) {
        // Remove the reaction if clicking the same type again
        await removeReactionFromComment(comment.id);
        
        // Update the comment locally
        const updatedReactions = comment.reactions.filter(r => r.userId !== currentUserId);
        onCommentUpdated({ ...comment, reactions: updatedReactions });
      } else {
        // Add or update the reaction
        const reaction = await addReactionToComment(comment.id, reactionType);
        
        // Update the comment locally
        const updatedReactions = comment.reactions.filter(r => r.userId !== currentUserId);
        updatedReactions.push(reaction);
        onCommentUpdated({ ...comment, reactions: updatedReactions });
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    } finally {
      setShowReactionPicker(false);
    }
  };
  
  // Handle comment deletion
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(comment.id);
        onCommentDeleted(comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
    setShowDropdown(false);
  };
  
  // Handle comment edit submission
  const handleEditSubmit = async () => {
    if (editText.trim() === '') return;
    
    try {
      const updatedComment = await updateComment(comment.id, editText);
      if (updatedComment) {
        onCommentUpdated(updatedComment);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };
  
  // Handle reply submission
  const handleReplySubmit = (newComment: Comment) => {
    onReplySubmitted(newComment);
    setIsReplying(false);
  };
  
  // Render reaction count summary
  const renderReactionSummary = () => {
    if (comment.reactions.length === 0) return null;
    
    const reactionCounts: Record<ReactionType, number> = {
      like: 0,
      love: 0,
      haha: 0,
      wow: 0,
      sad: 0,
      angry: 0,
    };
    
    comment.reactions.forEach(reaction => {
      reactionCounts[reaction.type]++;
    });
    
    const hasUserReacted = comment.reactions.some(r => r.userId === currentUserId);
    
    // Get total reaction count
    const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
    
    // Get top 2 reaction types
    const topReactions = Object.entries(reactionCounts)
      .filter(([, count]) => count > 0)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 2)
      .map(([type]) => type as ReactionType);
    
    return (
      <div 
        className={`flex items-center mt-2 px-2 py-1 rounded-full text-xs cursor-pointer ${
          hasUserReacted
            ? isDark 
              ? 'bg-blue-900/20 text-blue-300' 
              : 'bg-blue-50 text-blue-600'
            : isDark
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        onClick={() => setShowReactionPicker(true)}
      >
        <div className="flex -space-x-1 mr-1.5">
          {topReactions.includes('like') && 
            <span className="w-4 h-4 flex items-center justify-center">👍</span>}
          {topReactions.includes('love') && 
            <span className="w-4 h-4 flex items-center justify-center">❤️</span>}
          {topReactions.includes('haha') && 
            <span className="w-4 h-4 flex items-center justify-center">😂</span>}
          {topReactions.includes('wow') && 
            <span className="w-4 h-4 flex items-center justify-center">😮</span>}
          {topReactions.includes('sad') && 
            <span className="w-4 h-4 flex items-center justify-center">😢</span>}
          {topReactions.includes('angry') && 
            <span className="w-4 h-4 flex items-center justify-center">😠</span>}
        </div>
        <span>{totalReactions}</span>
      </div>
    );
  };
  
  // Render reactions picker
  const ReactionPicker = () => (
    <div 
      className={`absolute bottom-full left-0 mb-2 p-1 rounded-full shadow-lg flex items-center space-x-1 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}
    >
      <button
        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-lg transition-transform hover:scale-110"
        onClick={() => handleReactionClick('like')}
        aria-label="Like"
      >
        👍
      </button>
      <button
        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-lg transition-transform hover:scale-110"
        onClick={() => handleReactionClick('love')}
        aria-label="Love"
      >
        ❤️
      </button>
      <button
        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-lg transition-transform hover:scale-110"
        onClick={() => handleReactionClick('haha')}
        aria-label="Haha"
      >
        😂
      </button>
      <button
        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-lg transition-transform hover:scale-110"
        onClick={() => handleReactionClick('wow')}
        aria-label="Wow"
      >
        😮
      </button>
      <button
        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-lg transition-transform hover:scale-110"
        onClick={() => handleReactionClick('sad')}
        aria-label="Sad"
      >
        😢
      </button>
      <button
        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-lg transition-transform hover:scale-110"
        onClick={() => handleReactionClick('angry')}
        aria-label="Angry"
      >
        😠
      </button>
    </div>
  );
  
  // Dropdown menu for comment actions
  const DropdownMenu = () => (
    <div 
      className={`absolute top-full right-0 mt-1 py-1 w-36 rounded-md shadow-lg ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}
    >
      {isCommentAuthor && (
        <>
          <button
            className={`w-full text-left px-4 py-2 text-sm flex items-center ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => {
              setIsEditing(true);
              setShowDropdown(false);
            }}
          >
            <Edit2 size={14} className="mr-2" />
            Edit
          </button>
          
          <button
            className={`w-full text-left px-4 py-2 text-sm flex items-center ${
              isDark 
                ? 'hover:bg-gray-700 text-red-400' 
                : 'hover:bg-gray-100 text-red-600'
            }`}
            onClick={handleDelete}
          >
            <Trash2 size={14} className="mr-2" />
            Delete
          </button>
          
          <div className={`h-px mx-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </>
      )}
      
      <button
        className={`w-full text-left px-4 py-2 text-sm flex items-center ${
          isDark 
            ? 'hover:bg-gray-700 text-gray-300' 
            : 'hover:bg-gray-100 text-gray-700'
        }`}
        onClick={() => setShowDropdown(false)}
      >
        <Flag size={14} className="mr-2" />
        Report
      </button>
    </div>
  );
  
  // Highlighted text from the post (if any)
  const HighlightedText = () => (
    comment.highlightText ? (
      <div className={`mb-2 p-2 text-sm border-l-2 italic ${
        isDark 
          ? 'border-blue-400 bg-blue-900/10 text-gray-300' 
          : 'border-blue-500 bg-blue-50 text-gray-600'
      }`}>
        "{comment.highlightText}"
      </div>
    ) : null
  );
  
  // If comment is deleted or has moderation status other than approved
  if (isDeleted || comment.moderationStatus !== 'approved') {
    return (
      <div 
        className={`relative p-4 mb-4 rounded-lg ${
          isHighlighted
            ? isDark 
              ? 'border-l-4 border-blue-500 bg-blue-900/10' 
              : 'border-l-4 border-blue-500 bg-blue-50'
            : isDark 
              ? 'bg-gray-800' 
              : 'bg-gray-100'
        }`}
      >
        <div className="flex items-center">
          <AlertCircle size={18} className="mr-2 text-gray-400" />
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {isDeleted 
              ? 'This comment has been deleted.' 
              : comment.moderationStatus === 'rejected'
                ? 'This comment has been removed by a moderator.'
                : 'This comment is awaiting moderation.'}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      id={`comment-${comment.id}`}
      className={`relative p-4 mb-4 rounded-lg ${
        isHighlighted
          ? isDark 
            ? 'border-l-4 border-blue-500 bg-blue-900/10' 
            : 'border-l-4 border-blue-500 bg-blue-50'
          : isDark 
            ? 'bg-gray-800' 
            : 'bg-white border border-gray-200'
      }`}
    >
      {/* Comment header with author info */}
      <div className="flex justify-between">
        <div className="flex items-center mb-2">
          <img 
            src={comment.author.avatar || 'https://via.placeholder.com/40'} 
            alt={comment.author.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <div className="flex items-center">
              <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {comment.author.name}
              </span>
              {comment.author.id === 'admin' && (
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                  isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                }`}>
                  Author
                </span>
              )}
            </div>
            <div className="flex items-center text-xs">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                {formattedDate}
              </span>
              {isEdited && (
                <span className={`ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  • Edited
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Comment actions dropdown */}
        <div className="relative">
          <button
            className={`p-1 rounded-full ${
              isDark 
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="Comment actions"
          >
            <MoreHorizontal size={16} />
          </button>
          
          {showDropdown && <DropdownMenu />}
        </div>
      </div>
      
      {/* Highlighted text (if any) */}
      <HighlightedText />
      
      {/* Comment content */}
      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            aria-label="Edit comment"
          />
          <div className="mt-2 space-x-2">
            <button
              onClick={handleEditSubmit}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`mt-1 text-sm whitespace-pre-wrap ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          {comment.content}
        </div>
      )}
      
      {/* Comment actions */}
      <div className="mt-3 flex items-center space-x-2 text-xs">
        <div className="relative">
          <button
            className={`flex items-center px-2 py-1 rounded-full ${
              comment.reactions.some(r => r.userId === currentUserId)
                ? isDark 
                  ? 'text-blue-400 bg-blue-900/20' 
                  : 'text-blue-600 bg-blue-50'
                : isDark 
                  ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            aria-label="React to comment"
          >
            <Smile size={14} className="mr-1" />
            React
          </button>
          
          {showReactionPicker && <ReactionPicker />}
        </div>
        
        <button
          className={`flex items-center px-2 py-1 rounded-full ${
            isDark 
              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setIsReplying(!isReplying)}
          aria-label="Reply to comment"
        >
          <Reply size={14} className="mr-1" />
          Reply
        </button>
        
        {comment.replyCount > 0 && (
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            • {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
          </span>
        )}
      </div>
      
      {/* Reaction summary */}
      {renderReactionSummary()}
      
      {/* Reply form */}
      {isReplying && (
        <div className="mt-4 ml-8">
          <CommentForm 
            postId={postId}
            parentId={comment.id}
            onSubmit={handleReplySubmit}
            onCancel={() => setIsReplying(false)}
            placeholder={`Reply to ${comment.author.name}...`}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem; 