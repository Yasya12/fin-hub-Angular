import { Post } from "../../home/models/post.interface";

export interface Hub {
  id: string;
  name: string;
  description: string;
  mainPhotoUrl?: string;
  backgroundPhotoUrl?: string;
  posts?: Post[];
}