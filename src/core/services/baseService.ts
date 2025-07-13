import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { BaseResponse } from '../models/baseModel';

export class BaseService {
  private axiosInstance: AxiosInstance;

  constructor() {
    const baseURL = "https://hipocapp.com";
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );
  }

  public async get<TResponse>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<BaseResponse<TResponse>> {
    try {
      const response: AxiosResponse<BaseResponse<TResponse>> = await this.axiosInstance.get(url, {
        ...config,
        params,
      });
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error,
        message: error.response?.data?.message || 'GET hatası',
      };
    }
  }

  public async post<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<BaseResponse<TResponse>> {
    try {
      const response: AxiosResponse<BaseResponse<TResponse>> = await this.axiosInstance.post(url, data, config);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error,
        message: error.response?.data?.message || 'POST hatası',
      };
    }
  }

  public async put<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<BaseResponse<TResponse>> {
    try {
      const response: AxiosResponse<BaseResponse<TResponse>> = await this.axiosInstance.put(url, data, config);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error,
        message: error.response?.data?.message || 'PUT hatası',
      };
    }
  }

  public async patch<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<BaseResponse<TResponse>> {
    try {
      const response: AxiosResponse<BaseResponse<TResponse>> = await this.axiosInstance.patch(url, data, config);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error,
        message: error.response?.data?.message || 'PATCH hatası',
      };
    }
  }

  public async delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<BaseResponse<TResponse>> {
    try {
      const response: AxiosResponse<BaseResponse<TResponse>> = await this.axiosInstance.delete(url, config);
      return {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error,
        message: error.response?.data?.message || 'DELETE hatası',
      };
    }
  }
}
