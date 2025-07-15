export interface BaseResponseModel<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
