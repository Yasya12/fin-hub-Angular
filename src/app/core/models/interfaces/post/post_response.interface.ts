import { Post } from './post.interface';

export interface PostResponse {
  items: Post[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
