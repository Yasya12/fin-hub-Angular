export interface HubJoinRequest {
    id: string;
    habName: string;
    senderUsername: string;
    content: string;
    description?: string;
    status: string;
    requestedAt: Date;
}
