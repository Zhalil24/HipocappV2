// src/models/UserProfileModel.ts
import { RoleDTO } from "../role/roleModel";
import { AccessToken } from "../token/accessTokenModel";

export interface UserDataModel {
  id: number;
  rolId: number;
  iconId: number;
  degreeId: number;
  userName: string;
  name: string;
  surname: string;
  identityNumber: string;
  accessToken: AccessToken;
  imageURL: string;
  image: File | null;
  status: boolean | null;
  photoURL: string | null;
  photo: string | null;
  email: string;
  passwordRe: string | null;
  password: string | null;
  passwordRefreshToken: string;
  entries: any[];
  titles: any[];
  degree: any | null;
  phoneNumber: number | null;
  roleDTO: RoleDTO;
  iconDTO: any | null;
  isOnline: boolean | null;
  isTermsAccepted: boolean | null;
  username: string | null;
}
