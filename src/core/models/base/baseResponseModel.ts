export interface BaseResponseModel<T> {
  success: boolean;
  data: T | null; 
  message?: string;
  error?: string;
  isSuccess?: boolean;
}
