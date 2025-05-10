export interface CreatePost {
  id?: string;
  userEmail: string;
  content: string;
  images?: string[];
  hubId?: string
}