import { GroupMemberDto, GroupMessageModel, GroupModel, MessageModel } from "../chatMessage/messageModel";
import { UserDataModel } from "../user/userDataModel";

export interface InitialChatModel {
  users: UserDataModel[] | null;
  groups: GroupModel[] | [];
  chats: UserDataModel[] | null;
  lastMessages: MessageModel[] | null;
  unreadCounts: Record<number, number>;
  loading: boolean;
  error: string | null;
  message: string | null;
  connected: boolean;
  connecting: boolean;
  onlineUsers: number[];
  messagesByUser: Record<number, MessageModel[]>;
  messageByGroup: Record<number, GroupMessageModel[]>;
  groupMembersByGroup: Record<number, GroupMemberDto[]>;
  groupMembersLoadingByGroup: Record<number, boolean>;
  groupMembersErrorByGroup: Record<number, string | null>;
  addMembersLoadingByGroup?: Record<number, boolean>;
  addMembersErrorByGroup?: Record<number, string | null>;
}

export const chatModelInitialState: InitialChatModel = {
  users: [],
  groups: [],
  chats: [],
  loading: false,
  error: null,
  message: null,
  connecting: false,
  connected: false,
  onlineUsers: [],
  messagesByUser: {},
  lastMessages: [],
  unreadCounts: {},
  messageByGroup: {}, 
  groupMembersByGroup: {},
  groupMembersLoadingByGroup: {},
  groupMembersErrorByGroup: {},
  addMembersLoadingByGroup: {},
  addMembersErrorByGroup: {},
};
