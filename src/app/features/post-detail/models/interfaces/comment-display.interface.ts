export interface CommentDisplay {
    id: string;
    content: string;
    authorName: string; 
    createdAt: Date; 
    profilePictureUrl?: string
    parentId?: string | null;
    replies?: CommentDisplay[];  
}