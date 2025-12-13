import axios, { type AxiosRequestConfig } from 'axios';
import type PaginatedResponse from '../DTO/PaginatedResponse';
import type ApiResponse from './ApiResponse.interface';
import { getCsrfToken, fetchCsrfToken } from '../util/csrf';

abstract class ApiClient<T, V = Partial<T>> {
    protected endpoint: string;
    protected axiosInstance;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
        this.axiosInstance = axios.create({
            baseURL: import.meta.env['VITE_API_URL'],
            withCredentials: true,
        });

        // Add request interceptor to include CSRF token
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                // Only add CSRF token for state-changing methods
                if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(config.method?.toUpperCase() || '')) {
                    let token = getCsrfToken();
                    if (!token) {
                        token = await fetchCsrfToken();
                    }
                    if (token) {
                        config.headers['x-csrf-token'] = token;
                    }
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    getAll = (config?: AxiosRequestConfig) => this.axiosInstance.get<PaginatedResponse<T>>(this.endpoint, config).then((res) => res.data);

    getById = (id: number) => this.axiosInstance.get<T>(`${this.endpoint}/${id}`).then((res) => res.data);

    delete = (id: number) => this.axiosInstance.delete<T>(`${this.endpoint}/${id}`).then((res) => res.data);

    create = (data: V) => this.axiosInstance.post<ApiResponse<T>>(this.endpoint, data).then((res) => res.data);

    update = (id: number, data: Partial<T>) => this.axiosInstance.put<T>(`${this.endpoint}/${id}`, data).then((res) => res.data);
}

export default ApiClient;
