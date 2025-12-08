import axios, { type AxiosRequestConfig } from 'axios';
import type PaginatedResponse from '../DTO/PaginatedResponse';

class ApiClient<T, V = Partial<T>> {
    protected endpoint: string;
    protected axiosInstance;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
        this.axiosInstance = axios.create({
            baseURL: import.meta.env['VITE_API_URL'],
            withCredentials: true,
        });

        // Add response interceptor to handle errors
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                // Extract error message from backend response
                if (error.response?.data?.error?.message) {
                    const backendError = new Error(error.response.data.error.message);
                    backendError.name = 'ApiError';
                    return Promise.reject(backendError);
                }
                return Promise.reject(error);
            },
        );
    }

    getAll = (config?: AxiosRequestConfig) => this.axiosInstance.get<PaginatedResponse<T>>(this.endpoint, config).then((res) => res.data);

    getById = (id: number) => this.axiosInstance.get<T>(`${this.endpoint}/${id}`).then((res) => res.data);

    delete = (id: number) => this.axiosInstance.delete<T>(`${this.endpoint}/${id}`).then((res) => res.data);

    create = (data: V) => this.axiosInstance.post<T>(this.endpoint, data).then((res) => res.data);

    update = (id: number, data: Partial<T>) => this.axiosInstance.put<T>(`${this.endpoint}/${id}`, data).then((res) => res.data);
}

export default ApiClient;
