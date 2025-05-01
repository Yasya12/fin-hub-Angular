import { CommentDisplay } from "./comment-display.interface";

export interface SinglePost {
    id: string
    userName: string;
    categoryNames: string[];
    content: string;
    createdAt: Date;
    profilePictureUrl: string;
    likesCount: number;
    commentCount: number;
    images?: string[];
  }