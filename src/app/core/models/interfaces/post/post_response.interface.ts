import { Post } from '../../../../features/home/models/post.interface';

export interface PostResponse {
  items: Post[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
