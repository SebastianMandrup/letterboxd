import axios, { type AxiosRequestConfig } from 'axios';
import type PaginatedResponse from '../DTO/PaginatedResponse';
import type { ApiError } from './ApiError';
import type ApiResponse from './ApiResponse.interface';

// CSRF token management
let csrfToken: string | null = null;

const getCsrfToken = async (): Promise<string> => {
    if (csrfToken) {
        return csrfToken;
    }
    try {
        const response = await axios.get(`${import.meta.env['VITE_API_URL']}/csrf-token`, {
            withCredentials: true,
        });
        csrfToken = response.data.token;
        return csrfToken;
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        throw error;
    }
};

abstract class ApiClient<T, V = Partial<T>> {
    protected endpoint: string;
    protected axiosInstance;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
        this.axiosInstance = axios.create({
            baseURL: import.meta.env['VITE_API_URL'],
            withCredentials: true,
        });

        // Add CSRF token to non-GET requests
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                const method = config.method?.toUpperCase();
                if (method && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
                    try {
                        const token = await getCsrfToken();
                        config.headers['x-csrf-token'] = token;
                    } catch (error) {
                        console.error('Failed to add CSRF token:', error);
                    }
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                // If CSRF token is invalid, clear it and retry
                if (error.response?.status === 403 && error.response?.data?.error?.message?.includes('CSRF')) {
                    csrfToken = null;
                    const config = error.config;
                    if (!config._retry) {
                        config._retry = true;
                        try {
                            const token = await getCsrfToken();
                            config.headers['x-csrf-token'] = token;
                            return this.axiosInstance(config);
                        } catch (retryError) {
                            return Promise.reject(retryError);
                        }
                    }
                }

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
