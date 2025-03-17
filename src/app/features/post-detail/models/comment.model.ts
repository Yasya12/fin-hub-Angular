export interface Comment {
  id?: string;
  postId: string;
  content: string;
  authorId: string;
  parentId?: string | null;
  }