import { UserDataModel } from "../user/userDataModel";

export interface InitialChatModel {
  users: UserDataModel[] | null;   // Kişiler listesi
  groups: UserDataModel[] | null;  // Gruplar listesi
  chats: UserDataModel[] | null;   // Sohbet listesi
  loading: boolean;
  error: string | null;
  message: string | null;
}

export const chatModelInitialState: InitialChatModel = {
  users: [],
  groups: [],
  chats: [],
  loading: false,
  error: null,
  message: null,
};
