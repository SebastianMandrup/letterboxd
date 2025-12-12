import { useQuery } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';
import ms from 'ms';
import type MovieDto from '../../DTO/MovieDto';
import type PaginatedResponse from '../../DTO/PaginatedResponse';
import MovieClient from '../../services/MovieClient';

export default (config: AxiosRequestConfig) =>
    useQuery<PaginatedResponse<MovieDto>, Error>({
        queryKey: ['movies', config],
        queryFn: () => MovieClient.getAll(config),
        // initialData: featuredMovies,
        staleTime: ms('24 hours'),
        gcTime: ms('24 hours'),
    });
