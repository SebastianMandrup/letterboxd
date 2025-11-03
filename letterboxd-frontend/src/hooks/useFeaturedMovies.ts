import { useQuery } from "@tanstack/react-query";

// import films from "../data/films";
import type { PaginatedResponse } from '../services/apiClient';
import ApiClient from '../services/apiClient';
import type Movie from '../types/movie';

const apiClient = new ApiClient<Movie>("movies/featured");

export default () =>
    useQuery<PaginatedResponse<Movie>, Error>({
        queryKey: ["featuredMovies"],
        queryFn: apiClient.getAll,
        // initialData: films,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
