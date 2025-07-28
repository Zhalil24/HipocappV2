// src/models/UserProfileModel.ts
import { RandomEntryModel } from "../entries/randomEntryModel";
import { RoleDTO } from "../role/roleModel";
import { AccessToken } from "../token/accessTokenModel";

export interface ProfileState {
  data: UserProfileModel | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  message: string | null;
  activeComponent: 'profile' | 'edit' | 'password' | 'entries';
}

export const InitialStateProfileState : ProfileState = {
  data: null,
  status: 'idle',
  error: null,
  activeComponent: 'profile',
  message: ""
};

export interface UserProfileModel {
  id: number;
  rolId: number;
  iconId: number;
  degreeId: number;
  username: string;
  name: string;
  surname: string;
  identityNumber: string;
  accessToken: AccessToken;
  imageURL: string;
  image: string | null;
  photoURL: string | null;
  photo: string | null;
  email: string;
  passwordRe: string | null;
  password: string | null;
  passwordRefreshToken: string;
  entries: RandomEntryModel[];
  titles: any[];
  degree: any | null;
  roleDTO: RoleDTO;
  iconDTO: any | null;
  isOnline: boolean | null;
  isTermsAccepted: boolean | null;
}
