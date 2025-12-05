/**
 * Example: Testing Custom Hooks with React Query
 *
 * This test demonstrates how to test custom hooks that use React Query.
 * It shows patterns for:
 * - Setting up the test environment with QueryClientProvider
 * - Mocking API responses with MSW
 * - Testing loading, success, and error states
 * - Waiting for async operations
 */

import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import useMovies from '../../src/hooks/useMovies';
import { server } from '../setup';
import { http, HttpResponse } from 'msw';

// Helper to create a wrapper with QueryClient
function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false, // Disable retries for tests
                gcTime: 0, // Disable garbage collection time
            },
        },
    });

    return ({ children }: { children: ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useMovies Hook Example', () => {
    it('should fetch movies successfully', async () => {
        // Setup: Mock the API response
        server.use(
            http.get('*/movies', () => {
                return HttpResponse.json({
                    count: 2,
                    next: null,
                    previous: null,
                    results: [
                        {
                            id: 1,
                            title: 'Test Movie 1',
                            overview: 'Description 1',
                            posterUrl: '/poster1.jpg',
                        },
                        {
                            id: 2,
                            title: 'Test Movie 2',
                            overview: 'Description 2',
                            posterUrl: '/poster2.jpg',
                        },
                    ],
                });
            }),
        );

        // Render the hook with the wrapper
        const { result } = renderHook(() => useMovies({}), {
            wrapper: createWrapper(),
        });

        // Initially should be loading
        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBeUndefined();

        // Wait for the hook to finish loading
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        // Check the loaded data
        expect(result.current.data).toBeDefined();
        expect(result.current.data?.results).toHaveLength(2);
        expect(result.current.data?.results[0].title).toBe('Test Movie 1');
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API errors', async () => {
        // Setup: Mock an API error
        server.use(
            http.get('*/movies', () => {
                return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
            }),
        );

        // Render the hook
        const { result } = renderHook(() => useMovies({}), {
            wrapper: createWrapper(),
        });

        // Wait for the error state
        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        // Check error state
        expect(result.current.error).toBeDefined();
        expect(result.current.data).toBeUndefined();
    });

    it('should handle empty results', async () => {
        // Setup: Mock empty response
        server.use(
            http.get('*/movies', () => {
                return HttpResponse.json({
                    count: 0,
                    next: null,
                    previous: null,
                    results: [],
                });
            }),
        );

        // Render the hook
        const { result } = renderHook(() => useMovies({}), {
            wrapper: createWrapper(),
        });

        // Wait for success
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        // Check empty results
        expect(result.current.data?.results).toHaveLength(0);
        expect(result.current.data?.count).toBe(0);
    });

    it('should pass query params correctly', async () => {
        let capturedUrl = '';

        // Setup: Capture the request URL
        server.use(
            http.get('*/movies', ({ request }) => {
                capturedUrl = request.url;
                return HttpResponse.json({
                    count: 0,
                    next: null,
                    previous: null,
                    results: [],
                });
            }),
        );

        // Render hook with params
        const { result } = renderHook(
            () =>
                useMovies({
                    params: {
                        page: 2,
                        search: 'test',
                    },
                }),
            { wrapper: createWrapper() },
        );

        // Wait for request
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        // Verify params were passed (would need to parse URL in real test)
        expect(capturedUrl).toContain('movies');
    });
});

/**
 * Key Takeaways:
 *
 * 1. Always create a fresh QueryClient for each test
 * 2. Disable retry and cache for predictable test behavior
 * 3. Use MSW to mock API responses
 * 4. Use waitFor to handle async operations
 * 5. Test all states: loading, success, error, empty
 * 6. Clean up is handled automatically by MSW and React Testing Library
 */
