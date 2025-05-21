import { Comment, ReactionType, CommentReaction, ModerationType } from '../models/Comments';

// In-memory storage for comments (replace with actual database in production)
const comments: Comment[] = [];

export const addReactionToComment = async (commentId: string, reactionType: ReactionType, userId: string, userName: string): Promise<Comment> => {
  const comment = comments.find(c => c.id === commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  const existingReaction = comment.reactions.find(r => r.userId === userId && r.type === reactionType);
  if (!existingReaction) {
    const newReaction: CommentReaction = {
      id: Math.random().toString(36).substring(7),
      commentId,
      userId,
      userName,
      type: reactionType,
      createdAt: new Date().toISOString()
    };
    comment.reactions.push(newReaction);
  }

  return comment;
};

export const removeReactionFromComment = async (commentId: string, reactionType: ReactionType, userId: string): Promise<Comment> => {
  const comment = comments.find(c => c.id === commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  comment.reactions = comment.reactions.filter(r => !(r.userId === userId && r.type === reactionType));
  return comment;
};

export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
  const comment = comments.find(c => c.id === commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  comment.content = content;
  comment.updatedAt = new Date().toISOString();
  comment.isEdited = true;
  return comment;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  const index = comments.findIndex(c => c.id === commentId);
  if (index === -1) {
    throw new Error('Comment not found');
  }

  // Soft delete by marking as moderated and empty content
  const moderationStatus: ModerationType = 'rejected';
  comments[index].moderationStatus = moderationStatus;
  comments[index].content = '[Comment deleted]';
}; 