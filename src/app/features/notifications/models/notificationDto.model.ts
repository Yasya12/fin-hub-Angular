export interface NotificationDto {
    id: string;
    username: string;
    triggeredUserPhotoUrl: string;
    triggeredBy: string;
    type: string;
    content: string;
    postId: string;
    hubId: string;
    requestId: string;
    isRead: boolean;
    createdAt: Date;
    requestStatus: string;
}