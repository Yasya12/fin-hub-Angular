
export interface Follow {
  followingId: string;
  profilePhoroUrl: string;
  username: string;
  email?: string;
  bio?: string;
  isFollowedByCurrentUser: boolean;
  isUser: boolean;
}