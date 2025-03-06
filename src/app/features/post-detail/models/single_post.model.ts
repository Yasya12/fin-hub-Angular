import { CommentDisplay } from "../../../core/models/Comment/commentDisplay.model";

export interface SinglePost {
    id: string
    userName: string;
    categoryNames: string[];
    content: string;
    createdAt: Date;
    profilePictureUrl: string;
    likesCount: number;
    comments: CommentDisplay[];
    images?: string[];
  }