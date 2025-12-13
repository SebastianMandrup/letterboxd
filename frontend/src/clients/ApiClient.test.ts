import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import ApiClient from './ApiClient';

// Mock axios
vi.mock('axios');

interface TestItem {
    id: number;
    name: string;
}

class TestApiClient extends ApiClient<TestItem> {
    constructor() {
        super('/test');
    }
}

describe('ApiClient CSRF Integration', () => {
    let client: TestApiClient;
    let mockAxiosInstance: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock axios instance
        mockAxiosInstance = {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
            interceptors: {
                request: {
                    use: vi.fn((onFulfilled) => {
                        // Store the interceptor for testing
                        mockAxiosInstance._requestInterceptor = onFulfilled;
                        return 0;
                    }),
                },
                response: {
                    use: vi.fn((onFulfilled, onRejected) => {
                        mockAxiosInstance._responseInterceptor = {
                            onFulfilled,
                            onRejected,
                        };
                        return 0;
                    }),
                },
            },
        };

        (axios.create as any).mockReturnValue(mockAxiosInstance);

        client = new TestApiClient();
    });

    it('should create axios instance with correct config', () => {
        expect(axios.create).toHaveBeenCalledWith({
            baseURL: import.meta.env['VITE_API_URL'],
            withCredentials: true,
        });
    });

    it('should register request interceptor', () => {
        expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    });

    it('should register response interceptor', () => {
        expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });

    it('should make GET request', async () => {
        const mockData = {
            data: [{ id: 1, name: 'Test' }],
            pagination: {},
        };
        mockAxiosInstance.get.mockResolvedValue({ data: mockData });

        const result = await client.getAll();

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
        expect(result).toEqual(mockData);
    });

    it('should make POST request', async () => {
        const mockResponse = { data: { id: 1, name: 'New Item' } };
        mockAxiosInstance.post.mockResolvedValue(mockResponse);

        const newItem = { name: 'New Item' };
        const result = await client.create(newItem);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', newItem);
        expect(result).toEqual(mockResponse.data);
    });

    it('should make PUT request', async () => {
        const mockResponse = { data: { id: 1, name: 'Updated Item' } };
        mockAxiosInstance.put.mockResolvedValue(mockResponse);

        const updatedItem = { name: 'Updated Item' };
        const result = await client.update(1, updatedItem);

        expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test/1', updatedItem);
        expect(result).toEqual(mockResponse.data);
    });

    it('should make DELETE request', async () => {
        const mockResponse = { data: { id: 1, name: 'Deleted Item' } };
        mockAxiosInstance.delete.mockResolvedValue(mockResponse);

        const result = await client.delete(1);

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1');
        expect(result).toEqual(mockResponse.data);
    });

    it('should handle API errors correctly', async () => {
        const mockError = {
            response: {
                status: 404,
                data: {
                    error: {
                        message: 'Not found',
                    },
                },
            },
        };

        // Simulate the error interceptor behavior
        const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];

        try {
            await errorHandler(mockError);
            // Should not reach here
            expect.fail('Expected error to be thrown');
        } catch (transformedError: any) {
            expect(transformedError).toBeInstanceOf(Error);
            expect(transformedError.message).toBe('Not found');
            expect(transformedError.name).toBe('ApiError');
            expect(transformedError.status).toBe(404);
        }
    });

    it('should handle network errors', async () => {
        const mockError = {
            message: 'Network error',
        };

        const errorHandler = mockAxiosInstance.interceptors.response.use.mock.calls[0][1];

        try {
            await errorHandler(mockError);
            // Should not reach here
            expect.fail('Expected error to be thrown');
        } catch (transformedError: any) {
            expect(transformedError).toBeInstanceOf(Error);
            expect(transformedError.message).toBe('Network error');
            expect(transformedError.name).toBe('ApiError');
        }
    });
});
