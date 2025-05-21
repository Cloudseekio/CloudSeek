import { Author } from './Blog';

export type ModerationType = 'approved' | 'pending' | 'rejected' | 'spam';
export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
export type ContentRating = 1 | 2 | 3 | 4 | 5;

export interface CommentReaction {
  id: string;
  commentId: string;
  userId: string;
  userName: string;
  type: ReactionType;
  createdAt: string;
}

export interface PostReaction {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  type: ReactionType;
  createdAt: string;
}

export interface Highlight {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  text: string;
  startOffset: number;
  endOffset: number;
  createdAt: string;
  commentId?: string; // Optional reference to a comment
}

export interface ContentFeedback {
  id: string;
  postId: string;
  userId: string;
  userName?: string;
  rating: ContentRating;
  feedback?: string;
  createdAt: string;
}

export interface CommentNotification {
  id: string;
  userId: string;
  commentId: string;
  parentCommentId?: string;
  postId: string;
  postTitle: string;
  actorId: string;
  actorName: string;
  type: 'reply' | 'mention' | 'moderation';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: Author;
  parentId?: string; // If this is a reply, this is the ID of the parent comment
  createdAt: string;
  updatedAt?: string;
  moderationStatus: ModerationType;
  isEdited: boolean;
  reactions: CommentReaction[];
  highlightId?: string; // If this comment is attached to a highlight
  highlightText?: string; // The text that was highlighted
  replyCount: number;
  replies?: Comment[]; // For threaded comments
}

export interface EngagementMetrics {
  postId: string;
  viewCount: number;
  uniqueViewCount: number;
  commentCount: number;
  reactionCounts: {
    [key in ReactionType]: number;
  };
  averageRating: number;
  ratingCount: number;
  highlightCount: number;
  shareCount: number;
}

// For analytics purposes
export interface UserEngagement {
  userId: string;
  postId: string;
  engagementType: 'view' | 'comment' | 'reaction' | 'rating' | 'highlight' | 'share';
  timestamp: string;
  duration?: number; // For view time
  details?: string; // Any additional details
} 