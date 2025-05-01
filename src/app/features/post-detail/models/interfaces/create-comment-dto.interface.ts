export interface CreateCommentDto {
  postId: string;
  content: string;
  parentId?: string;
  authorId?: string;
}