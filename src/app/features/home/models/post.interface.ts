export interface Post {
    id: string
    userName: string;
    categoryNames: string[];
    content: string;
    createdAt: Date;
    profilePictureUrl: string;
    likesCount: number;
    commentsCount: number;
    isLiked?: boolean; 
    images?: string[];
    hubId?: string;
  }