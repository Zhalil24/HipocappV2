export type MessageModel = {
    id: number | null;
    fromUserId: number | null;
    toUserId: number;
    messageText: string;
    sentAt: string | Date;
    isRead: boolean | null;
}

export type UnreadCountItem = { fromUserId: number; count: number };

export type MarkMessageModel = { fromUserId: number; toUserId: number; }

export type GroupMemberModel = {
    groupId: number;
    userId: number;
    userName?: string;
    joinedOn: string;
};

export type GroupModel = {
    id: number;
    groupName: string;
    createdOn: string;
    members: GroupMemberModel[];
};

export type GroupMessageModel = {
    fromUserId: number;
    groupId: number;
    messageText?: string;
    fromUserName?: string;
    sentAt: string;
}