export interface Post {
    userName: string;
    categoryNames: string[];
    title: string;
    content: string;
    createdAt: Date;
    profilePictureUrl: string;
    likesCount: number;
    commentTexts: string[];
  }