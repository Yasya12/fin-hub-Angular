export interface SinglePost {
    id: string
    userName: string;
    categoryNames: string[];
    title: string;
    content: string;
    createdAt: Date;
    profilePictureUrl: string;
    likesCount: number;
    comments: Comment[];
  }