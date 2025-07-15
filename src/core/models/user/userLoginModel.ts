export interface UserLoginModel {
    userName: string;
    password: string;
}

export interface InitialUserLoginModel {
  data: UserLoginModel | null;
  loading: boolean;
  error: string | null;
  isLogin: boolean | null;
  userRole: string | '';
}

export const userLoginModelState: InitialUserLoginModel = {
  data: null,
  loading: false,
  error: null,
  isLogin: false,
  userRole: ''
};
