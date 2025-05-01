export interface Message {
    id: string
    senderId: string
    senderUserName: string
    senderUPhotoUrl: any
    recipientId: string
    recipientUserName: string
    recipientUPhotoUrl: any
    content: string
    dateRead?: Date
    messageSent: Date
  }
  