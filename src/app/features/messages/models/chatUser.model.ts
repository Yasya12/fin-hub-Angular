export interface ChatUserDto {
    username: string;
    email: string;
    photoUrl: string;
    lastMessage: string;
    lastMessageSent: Date;
    isRead: boolean
    unreadCount: number;
    isSelected: boolean;
    isOnline ?: boolean;
  }