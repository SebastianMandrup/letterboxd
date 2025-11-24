import { useQuery } from "@tanstack/react-query";

import type { AxiosRequestConfig } from 'axios';
import ms from 'ms';
import type { PaginatedResponse } from '../services/ApiClient';
import type { Movie } from '../services/movieService';
import movieService from '../services/movieService';

export default (config: AxiosRequestConfig) =>
    useQuery<PaginatedResponse<Movie>, Error>({
        queryKey: ["movies", config],
        queryFn: () => movieService.getAll(config),
        // initialData: featuredMovies,
        staleTime: ms("24 hours"),
        gcTime: ms("24 hours"),
    });
