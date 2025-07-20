import { LoginResponseModel } from "./loginResponseModel";

export interface UserLoginModel {
    userName: string;
    password: string;
}

export interface InitialUserLoginModel {
  data: LoginResponseModel  | null;
  loading: boolean;
  error: string | null;
  isLogin: boolean | null;
  userRole: string | '';
  message: string | '';
}

export const userLoginModelState: InitialUserLoginModel = {
  data: null,
  loading: false,
  error: null,
  isLogin: false,
  userRole: '',
  message: '',
};
