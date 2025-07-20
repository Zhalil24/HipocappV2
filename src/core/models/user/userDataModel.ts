import { RoleDTO } from "../role/roleModel";
import { AccessToken } from "../token/accessTokenModel";
import { AuthItemModel } from "./authItemModel";

export interface UserDataModel {
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
  entries: any[]; 
  titles: any[];  
  degree: any | null; 
  roleDTO: RoleDTO;
  iconDTO: any | null; 
  authList: AuthItemModel[];
  isOnline: boolean | null;
  isTermsAccepted: boolean | null;
}
