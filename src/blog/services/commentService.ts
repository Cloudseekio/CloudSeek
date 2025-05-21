import { v4 as uuidv4 } from 'uuid';
import { 
  Comment, 
  CommentReaction, 
  PostReaction, 
  Highlight, 
  ContentFeedback, 
  CommentNotification,
  ReactionType,
  ModerationType,
  ContentRating,
  EngagementMetrics,
  UserEngagement
} from '../../models/Comments';
import { Author } from '../../models/Blog';

// Mock data for development purposes
let comments: Comment[] = [];
let reactions: (CommentReaction | PostReaction)[] = [];
let highlights: Highlight[] = [];
let feedback: ContentFeedback[] = [];
let notifications: CommentNotification[] = [];
let metrics: EngagementMetrics[] = [];
let engagementHistory: UserEngagement[] = [];

// Helper functions
const getCurrentUser = (): { id: string; name: string } => {
  // In a real app, this would come from authentication
  return { id: 'user-1', name: 'Current User' };
};

const getAuthorFromUser = (): Author => {
  // In a real app, this would pull real user data
  return {
    id: getCurrentUser().id,
    name: getCurrentUser().name,
    avatar: 'https://via.placeholder.com/40',
  };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate network latency for mock API
const simulateNetworkDelay = async () => {
  await delay(Math.random() * 300 + 200); // 200-500ms delay
};

// Comments API
export const getComments = async (postId: string, parentId?: string): Promise<Comment[]> => {
  await simulateNetworkDelay();
  
  return comments
    .filter(comment => 
      comment.postId === postId && 
      comment.parentId === parentId &&
      comment.moderationStatus === 'approved'
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getComment = async (commentId: string): Promise<Comment | null> => {
  await simulateNetworkDelay();
  
  const comment = comments.find(c => c.id === commentId);
  return comment || null;
};

export const createComment = async (postId: string, content: string, parentId?: string, highlightId?: string): Promise<Comment> => {
  await simulateNetworkDelay();
  
  const user = getCurrentUser();
  const author = getAuthorFromUser();
  const highlight = highlightId ? highlights.find(h => h.id === highlightId) : undefined;
  
  const newComment: Comment = {
    id: uuidv4(),
    postId,
    content,
    author,
    parentId,
    createdAt: new Date().toISOString(),
    moderationStatus: 'pending', // All comments start as pending
    isEdited: false,
    reactions: [],
    highlightId,
    highlightText: highlight?.text,
    replyCount: 0
  };
  
  comments.push(newComment);
  
  // Update reply count on parent comment
  if (parentId) {
    const parentComment = comments.find(c => c.id === parentId);
    if (parentComment) {
      parentComment.replyCount += 1;
      
      // Create notification for reply
      createNotification({
        userId: parentComment.author.id,
        commentId: newComment.id,
        parentCommentId: parentId,
        postId,
        postTitle: 'Blog Post Title', // In real app, fetch the actual title
        actorId: user.id,
        actorName: user.name,
        type: 'reply',
        message: `${user.name} replied to your comment`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  }
  
  // Create engagement record
  trackEngagement(user.id, postId, 'comment', newComment.id);
  
  return newComment;
};

export const updateComment = async (commentId: string, content: string): Promise<Comment | null> => {
  await simulateNetworkDelay();
  
  const index = comments.findIndex(c => c.id === commentId);
  if (index === -1) return null;
  
  // In a real app, check if user has permission to edit this comment
  comments[index] = {
    ...comments[index],
    content,
    updatedAt: new Date().toISOString(),
    isEdited: true
  };
  
  return comments[index];
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
  await simulateNetworkDelay();
  
  const index = comments.findIndex(c => c.id === commentId);
  if (index === -1) return false;
  
  // In a real app, check if user has permission to delete this comment
  
  // Get parent ID before deletion
  const parentId = comments[index].parentId;
  
  // Remove the comment
  comments.splice(index, 1);
  
  // Update parent's reply count if needed
  if (parentId) {
    const parentComment = comments.find(c => c.id === parentId);
    if (parentComment) {
      parentComment.replyCount = Math.max(0, parentComment.replyCount - 1);
    }
  }
  
  // Also delete all child comments and related data
  const childComments = comments.filter(c => c.parentId === commentId);
  for (const child of childComments) {
    await deleteComment(child.id);
  }
  
  // Remove all reactions to this comment
  reactions = reactions.filter(r => 
    !(r as CommentReaction).commentId || (r as CommentReaction).commentId !== commentId
  );
  
  // Remove all notifications for this comment
  notifications = notifications.filter(n => n.commentId !== commentId);
  
  return true;
};

export const moderateComment = async (commentId: string, status: ModerationType): Promise<Comment | null> => {
  await simulateNetworkDelay();
  
  const index = comments.findIndex(c => c.id === commentId);
  if (index === -1) return null;
  
  // In a real app, check if user has moderation permissions
  
  comments[index] = {
    ...comments[index],
    moderationStatus: status
  };
  
  // Notify the comment author about moderation decision
  if (status === 'approved' || status === 'rejected') {
    const user = getCurrentUser();
    
    createNotification({
      userId: comments[index].author.id,
      commentId,
      postId: comments[index].postId,
      postTitle: 'Blog Post Title', // In real app, fetch the actual title
      actorId: user.id,
      actorName: user.name,
      type: 'moderation',
      message: `Your comment was ${status}`,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }
  
  return comments[index];
};

// Reactions API
export const addReactionToComment = async (commentId: string, type: ReactionType): Promise<CommentReaction> => {
  await simulateNetworkDelay();
  
  const user = getCurrentUser();
  
  // Check if user already reacted
  const existingReaction = reactions.find(r => 
    (r as CommentReaction).commentId === commentId && 
    r.userId === user.id
  ) as CommentReaction | undefined;
  
  if (existingReaction) {
    // Update existing reaction
    existingReaction.type = type;
    return existingReaction;
  }
  
  // Create new reaction
  const comment = comments.find(c => c.id === commentId);
  if (!comment) throw new Error('Comment not found');
  
  const newReaction: CommentReaction = {
    id: uuidv4(),
    commentId,
    userId: user.id,
    userName: user.name,
    type,
    createdAt: new Date().toISOString()
  };
  
  reactions.push(newReaction);
  comment.reactions.push(newReaction);
  
  // Create engagement record
  trackEngagement(user.id, comment.postId, 'reaction', commentId);
  
  return newReaction;
};

export const removeReactionFromComment = async (commentId: string): Promise<boolean> => {
  await simulateNetworkDelay();
  
  const user = getCurrentUser();
  
  // Find and remove the reaction
  const reactionIndex = reactions.findIndex(r => 
    (r as CommentReaction).commentId === commentId && 
    r.userId === user.id
  );
  
  if (reactionIndex === -1) return false;
  
  reactions.splice(reactionIndex, 1);
  
  // Remove from comment object too
  const comment = comments.find(c => c.id === commentId);
  if (comment) {
    comment.reactions = comment.reactions.filter(r => r.userId !== user.id);
  }
  
  return true;
};

export const addReactionToPost = async (postId: string, type: ReactionType): Promise<PostReaction> => {
  await simulateNetworkDelay();
  
  const user = getCurrentUser();
  
  // Check if user already reacted
  const existingReaction = reactions.find(r => 
    (r as PostReaction).postId === postId && 
    r.userId === user.id &&
    !(r as CommentReaction).commentId
  ) as PostReaction | undefined;
  
  if (existingReaction) {
    // Update existing reaction
    existingReaction.type = type;
    return existingReaction;
  }
  
  // Create new reaction
  const newReaction: PostReaction = {
    id: uuidv4(),
    postId,
    userId: user.id,
    userName: user.name,
    type,
    createdAt: new Date().toISOString()
  };
  
  reactions.push(newReaction);
  
  // Update metrics
  updateMetrics(postId);
  
  // Create engagement record
  trackEngagement(user.id, postId, 'reaction');
  
  return newReaction;
};

export const removeReactionFromPost = async (postId: string): Promise<boolean> => {
  await simulateNetworkDelay();
  
  const user = getCurrentUser();
  
  // Find and remove the reaction
  const reactionIndex = reactions.findIndex(r => 
    (r as PostReaction).postId === postId && 
    r.userId === user.id &&
    !(r as CommentReaction).commentId
  );
  
  if (reactionIndex === -1) return false;
  
  reactions.splice(reactionIndex, 1);
  
  // Update metrics
  updateMetrics(postId);
  
  return true;
};

// Highlights and Feedback API
export const createHighlight = async (postId: string, text: string, startOffset: number, endOffset: number): Promise<Highlight> => {
  await simulateNetworkDelay();
  
  const user = getCurrentUser();
  
  const newHighlight: Highlight = {
    id: uuidv4(),
    postId,
    userId: user.id,
    userName: user.name,
    text,
    startOffset,
    endOffset,
    createdAt: new Date().toISOString()
  };
  
  highlights.push(newHighlight);
  
  // Update metrics
  updateMetrics(postId);
  
  // Create engagement record
  trackEngagement(user.id, postId, 'highlight');
  
  return newHighlight;
};

export const getHighlights = async (postId: string): Promise<Highlight[]> => {
  await simulateNetworkDelay();
  
  return highlights.filter(h => h.postId === postId);
};

export const submitContentFeedback = async (postId: string, rating: ContentRating, feedbackText?: string): Promise<ContentFeedback> => {
  await simulateNetworkDelay();
  
  const user = getCurrentUser();
  
  // Check if user already provided feedback
  const existingFeedback = feedback.find(f => f.postId === postId && f.userId === user.id);
  
  if (existingFeedback) {
    // Update existing feedback
    existingFeedback.rating = rating;
    existingFeedback.feedback = feedbackText;
    return existingFeedback;
  }
  
  // Create new feedback
  const newFeedback: ContentFeedback = {
    id: uuidv4(),
    postId,
    userId: user.id,
    userName: user.name,
    rating,
    feedback: feedbackText,
    createdAt: new Date().toISOString()
  };
  
  feedback.push(newFeedback);
  
  // Update metrics
  updateMetrics(postId);
  
  // Create engagement record
  trackEngagement(user.id, postId, 'rating', String(rating));
  
  return newFeedback;
};

// Notifications API
export const createNotification = async (notification: Omit<CommentNotification, 'id' | 'createdAt'>): Promise<CommentNotification> => {
  const newNotification: CommentNotification = {
    ...notification,
    id: uuidv4(),
    createdAt: new Date().toISOString()
  };
  
  notifications.push(newNotification);
  
  return newNotification;
};

export const getNotifications = async (userId: string): Promise<CommentNotification[]> => {
  await simulateNetworkDelay();
  
  return notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  await simulateNetworkDelay();
  
  const notification = notifications.find(n => n.id === notificationId);
  
  if (!notification) return false;
  
  notification.isRead = true;
  return true;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  await simulateNetworkDelay();
  
  const userNotifications = notifications.filter(n => n.userId === userId);
  
  for (const notification of userNotifications) {
    notification.isRead = true;
  }
  
  return true;
};

// Analytics and Metrics API
export const getPostEngagementMetrics = async (postId: string): Promise<EngagementMetrics> => {
  await simulateNetworkDelay();
  
  let metric = metrics.find(m => m.postId === postId);
  
  if (!metric) {
    // Create new metrics object
    metric = createInitialMetrics(postId);
    metrics.push(metric);
  }
  
  return metric;
};

export const recordPostView = async (postId: string, userId: string): Promise<void> => {
  await simulateNetworkDelay();
  
  let metric = metrics.find(m => m.postId === postId);
  
  if (!metric) {
    metric = createInitialMetrics(postId);
    metrics.push(metric);
  }
  
  // Increment view counters
  metric.viewCount += 1;
  
  // Check if this is a unique view
  const hasViewedBefore = engagementHistory.some(e => 
    e.postId === postId && 
    e.userId === userId && 
    e.engagementType === 'view'
  );
  
  if (!hasViewedBefore) {
    metric.uniqueViewCount += 1;
  }
  
  // Create engagement record
  trackEngagement(userId, postId, 'view');
};

export const recordShare = async (postId: string, platform: string): Promise<void> => {
  await simulateNetworkDelay();
  
  const user = getCurrentUser();
  
  let metric = metrics.find(m => m.postId === postId);
  
  if (!metric) {
    metric = createInitialMetrics(postId);
    metrics.push(metric);
  }
  
  // Increment share counter
  metric.shareCount += 1;
  
  // Create engagement record
  trackEngagement(user.id, postId, 'share', platform);
};

// Helper functions for metrics
const createInitialMetrics = (postId: string): EngagementMetrics => {
  return {
    postId,
    viewCount: 0,
    uniqueViewCount: 0,
    commentCount: 0,
    reactionCounts: {
      like: 0,
      love: 0,
      haha: 0,
      wow: 0,
      sad: 0,
      angry: 0
    },
    averageRating: 0,
    ratingCount: 0,
    highlightCount: 0,
    shareCount: 0
  };
};

const updateMetrics = (postId: string) => {
  let metric = metrics.find(m => m.postId === postId);
  
  if (!metric) {
    metric = createInitialMetrics(postId);
    metrics.push(metric);
  }
  
  // Update comment count
  metric.commentCount = comments.filter(c => 
    c.postId === postId && 
    c.moderationStatus === 'approved'
  ).length;
  
  // Update reaction counts
  const postReactions = reactions.filter(r => 
    (r as PostReaction).postId === postId &&
    !(r as CommentReaction).commentId
  );
  
  const reactionCounts = {
    like: 0,
    love: 0,
    haha: 0,
    wow: 0,
    sad: 0,
    angry: 0
  };
  
  for (const reaction of postReactions) {
    reactionCounts[reaction.type]++;
  }
  
  metric.reactionCounts = reactionCounts;
  
  // Update rating
  const postFeedback = feedback.filter(f => f.postId === postId);
  metric.ratingCount = postFeedback.length;
  
  if (metric.ratingCount > 0) {
    const totalRating = postFeedback.reduce((sum, item) => sum + item.rating, 0);
    metric.averageRating = totalRating / metric.ratingCount;
  } else {
    metric.averageRating = 0;
  }
  
  // Update highlight count
  metric.highlightCount = highlights.filter(h => h.postId === postId).length;
};

const trackEngagement = (userId: string, postId: string, engagementType: UserEngagement['engagementType'], details?: string) => {
  const engagement: UserEngagement = {
    userId,
    postId,
    engagementType,
    timestamp: new Date().toISOString(),
    details
  };
  
  engagementHistory.push(engagement);
}; 