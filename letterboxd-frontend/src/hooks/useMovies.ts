import { useQuery } from "@tanstack/react-query";

import type { AxiosRequestConfig } from 'axios';
import ms from 'ms';
import movieService from '../services/movieService';
import type Movie from "../DTO/MovieDto";
import type PaginatedResponse from "../DTO/PaginatedResponse";

export default (config: AxiosRequestConfig) =>
    useQuery<PaginatedResponse<Movie>, Error>({
        queryKey: ["movies", config],
        queryFn: () => movieService.getAll(config),
        // initialData: featuredMovies,
        staleTime: ms("24 hours"),
        gcTime: ms("24 hours"),
    });
