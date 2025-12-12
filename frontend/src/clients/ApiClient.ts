import axios, { type AxiosRequestConfig } from 'axios';
import type PaginatedResponse from '../DTO/PaginatedResponse';
import type { ApiError } from './ApiError';
import type ApiResponse from './ApiResponse.interface';

abstract class ApiClient<T, V = Partial<T>> {
    protected endpoint: string;
    protected axiosInstance;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
        this.axiosInstance = axios.create({
            baseURL: import.meta.env['VITE_API_URL'],
            withCredentials: true,
        });

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                const errorMessage = error.response?.data?.error?.message || error.message || 'An unexpected error occurred';
                const backendError: ApiError = new Error(errorMessage);
                backendError.name = 'ApiError';
                backendError.status = error.response?.status;
                return Promise.reject(backendError);
            },
        );
    }

    getAll = (config?: AxiosRequestConfig) => this.axiosInstance.get<PaginatedResponse<T>>(this.endpoint, config).then((res) => res.data);

    getById = (id: number) => this.axiosInstance.get<T>(`${this.endpoint}/${id}`).then((res) => res.data);

    delete = (id: number) => this.axiosInstance.delete<T>(`${this.endpoint}/${id}`).then((res) => res.data);

    create = (data: V) => this.axiosInstance.post<ApiResponse<T>>(this.endpoint, data).then((res) => res.data);

    update = (id: number, data: Partial<T>) => this.axiosInstance.put<T>(`${this.endpoint}/${id}`, data).then((res) => res.data);
}

export default ApiClient;
