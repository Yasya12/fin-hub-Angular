export interface Comment {
  postId: string;
  content: string;
  authorId: string;
  parentCommentId?: string;
  }