/** Every API answer has this shape: isSuccess, the data and a message for the user. */
export interface BaseResponseModel<T> {
  isSuccess: boolean;
  data: T | null;
  message?: string;
  error?: string;
}
