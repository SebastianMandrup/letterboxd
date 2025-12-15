import axios from 'axios';

let csrfToken: string | null = null;

export const fetchCsrfToken = async (): Promise<string> => {
    try {
        const response = await axios.get<{ token: string }>(`${import.meta.env['VITE_API_URL']}/auth/csrf-token`, { withCredentials: true });
        csrfToken = response.data.token;
        return csrfToken;
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        throw error;
    }
};

export const getCsrfToken = (): string | null => {
    return csrfToken;
};

export const clearCsrfToken = (): void => {
    csrfToken = null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const csrfTokenInterceptor = async (config: any) => {
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
};
