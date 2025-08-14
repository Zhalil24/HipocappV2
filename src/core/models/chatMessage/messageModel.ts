export type MessageModel = {
    id: number | null;
    fromUserId: number | null;
    toUserId: number;
    messageText: string;
    sentAt: string | Date;
    isRead: boolean | null;
}