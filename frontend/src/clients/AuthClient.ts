import axios from 'axios';
import type UserDto from '../DTO/UserDto';
import { getCsrfToken, fetchCsrfToken, clearCsrfToken } from '../util/csrf';

export interface PaginatedUserResponse {
    count: number;
    previous?: string | null;
    next?: string | null;
    results: UserDto[];
}

const axiosInstance = axios.create({
    baseURL: import.meta.env['VITE_API_URL'] + '/auth',
    withCredentials: true,
});

// Add request interceptor to include CSRF token
axiosInstance.interceptors.request.use(
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

class AuthClient {
    me = () => axiosInstance.get<UserDto>('/me').then((res) => res.data);

    login = async (data: { username: string; password: string }) => {
        const result = await axiosInstance
            .post<{
                message: string;
                user: UserDto;
            }>('/login', data)
            .then((res) => res.data);
        
        // Fetch CSRF token after successful login
        await fetchCsrfToken();
        
        return result;
    };

    logout = async () => {
        const result = await axiosInstance.post('/logout').then((res) => res.data);
        
        // Clear CSRF token after logout
        clearCsrfToken();
        
        return result;
    };
}

export default AuthClient;
