import { MessageModel } from "../chatMessage/messageModel";
import { UserDataModel } from "../user/userDataModel";

export interface InitialChatModel {
  users: UserDataModel[] | null;   // Kişiler listesi
  groups: UserDataModel[] | null;  // Gruplar listesi
  chats: UserDataModel[] | null;   // Sohbet listesi
  loading: boolean;
  error: string | null;
  message: string | null;
  connected: boolean;
  connecting: boolean;
  onlineUsers: number[];
  messagesByUser: Record<number, MessageModel[]>;
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
};
