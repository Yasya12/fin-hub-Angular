export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  profilePictureUrl: string;
  bio: string;
  country: string;
  createdAt: Date;
  followingCount: number;
  folowersCount: number;
  postsCount: number;
}
