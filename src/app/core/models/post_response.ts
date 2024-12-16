import { Post } from "./post.model";

export interface PostResponse {
    items: Post[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  }