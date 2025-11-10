import { useQuery } from "@tanstack/react-query";

import type { AxiosRequestConfig } from 'axios';
import ms from 'ms';
import type { PaginatedResponse } from '../services/apiClient';
import ApiClient from '../services/apiClient';
import type Movie from '../types/movie';

const apiClient = new ApiClient<Movie>("movies");

export default (config: AxiosRequestConfig) =>
    useQuery<PaginatedResponse<Movie>, Error>({
        queryKey: ["movies", config],
        queryFn: () => apiClient.getAll(config),
        // initialData: featuredMovies,
        staleTime: ms("24 hours"),
        gcTime: ms("24 hours"),
    });
