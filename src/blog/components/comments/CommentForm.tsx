import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { createComment } from '../../services/commentService';
import { Comment } from '../../../models/Comments';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  highlightText?: string;
  highlightPosition?: { start: number; end: number };
  onSubmit: (comment: Comment) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  parentId,
  highlightText,
  highlightPosition,
  onSubmit,
  onCancel,
  placeholder = 'Add a comment...',
  autoFocus = false
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Character limit for comments
  const MAX_CHARS = 1000;
  
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);
  
  // Update character count when content changes
  useEffect(() => {
    setCharCount(content.length);
  }, [content]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent);
      setError(null);
    } else {
      setError(`Comment exceeds maximum length of ${MAX_CHARS} characters`);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim() === '') {
      setError('Comment cannot be empty');
      return;
    }
    
    if (content.length > MAX_CHARS) {
      setError(`Comment exceeds maximum length of ${MAX_CHARS} characters`);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const newComment = await createComment({
        postId,
        parentId,
        content: content.trim(),
        highlightText,
        highlightPosition
      });
      
      if (newComment) {
        onSubmit(newComment);
        setContent('');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setContent('');
    setError(null);
    
    if (onCancel) {
      onCancel();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {/* Highlighted text (if replying to a highlight) */}
      {highlightText && (
        <div className={`mb-2 p-2 text-sm border-l-2 italic ${
          isDark 
            ? 'border-blue-400 bg-blue-900/10 text-gray-300' 
            : 'border-blue-500 bg-blue-50 text-gray-600'
        }`}>
          "{highlightText}"
        </div>
      )}
      
      <div className={`relative border rounded-lg overflow-hidden ${
        isDark 
          ? 'border-gray-700 bg-gray-800' 
          : 'border-gray-300 bg-white'
      }`}>
        {/* Textarea input */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label={placeholder}
          className={`w-full p-3 resize-none text-sm focus:outline-none ${
            isDark 
              ? 'bg-gray-800 text-gray-200 placeholder-gray-500' 
              : 'bg-white text-gray-800 placeholder-gray-400'
          }`}
          rows={3}
          disabled={isSubmitting}
        />
        
        {/* Character count and actions */}
        <div className={`flex items-center justify-between p-2 border-t ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          {/* Character count */}
          <div className="text-xs">
            <span className={charCount > MAX_CHARS ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-500'}>
              {charCount}
            </span>
            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>/{MAX_CHARS}</span>
          </div>
          
          {/* Action buttons */}
          <div className="flex space-x-2">
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className={`p-1.5 rounded-full flex items-center justify-center ${
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                    : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                }`}
                disabled={isSubmitting}
                aria-label="Cancel"
              >
                <X size={16} />
              </button>
            )}
            
            <button
              type="submit"
              className={`px-3 py-1.5 rounded-full flex items-center ${
                content.trim() === '' || isSubmitting
                  ? isDark 
                    ? 'bg-blue-800/50 text-blue-300/50 cursor-not-allowed' 
                    : 'bg-blue-100 text-blue-400 cursor-not-allowed'
                  : isDark 
                    ? 'bg-blue-600 text-white hover:bg-blue-500' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={content.trim() === '' || isSubmitting}
              aria-label="Submit comment"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="mr-1 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send size={14} className="mr-1" />
                  <span>Post</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </form>
  );
};

export default CommentForm; 