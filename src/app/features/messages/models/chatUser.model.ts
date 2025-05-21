export interface ChatUserDto {
    username: string;
    photoUrl: string;
    lastMessage: string;
    lastMessageSent: Date;
    isRead: boolean
    unreadCount: number;
  }