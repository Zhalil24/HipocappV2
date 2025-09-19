import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { BaseResponseModel } from '../models/base/baseResponseModel';
import { UserDataModel } from '../models/user/userDataModel';


export class BaseService {
  private axiosInstance: AxiosInstance;

  constructor() {
    const baseURL = "https://hipocapp.com/";
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
  ): Promise<BaseResponseModel<TResponse>> {
    try {
      const response: AxiosResponse<BaseResponseModel<TResponse>> =
        await this.axiosInstance.get(url, {
          ...config,
          params,
        });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'GET hatası',
        error: ''
      };
    }
  }

  public async post<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<BaseResponseModel<TResponse>> {
    try {
      const response: AxiosResponse<BaseResponseModel<TResponse>> =
        await this.axiosInstance.post(url, data, config);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Daha sonra tekrar deneyiniz.',
        error: ''
      };
    }
  }

  public async put<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<BaseResponseModel<TResponse>> {
    try {
      const response: AxiosResponse<BaseResponseModel<TResponse>> =
        await this.axiosInstance.put(url, data, config);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'PUT hatası',
        error: ''
      };
    }
  }

  public async patch<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<BaseResponseModel<TResponse>> {
    try {
      const response: AxiosResponse<BaseResponseModel<TResponse>> =
        await this.axiosInstance.patch(url, data, config);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'PATCH hatası',
        error: ''
      };
    }
  }

  public async delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<BaseResponseModel<TResponse>> {
    try {
      const response: AxiosResponse<BaseResponseModel<TResponse>> =
        await this.axiosInstance.delete(url, config);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'DELETE hatası',
        error: ''
      };
    }
  }

}

export const BaseServiceInstance = new BaseService();
