import { useQuery } from '@tanstack/react-query';

import ms from 'ms';
import movieService from '../services/movieService';
import type MovieDto from '../DTO/MovieDto';
import type PaginatedResponse from '../DTO/PaginatedResponse';
import featuredMovies from '../data/featuredMovies';

export default () =>
    useQuery<PaginatedResponse<MovieDto>, Error>({
        queryKey: ['featured-movies'],
        queryFn: () => movieService.getAll({ params: { featured: true, pageSize: 6 } }),
        initialData: featuredMovies,
        staleTime: ms('24 hours'),
        gcTime: ms('24 hours'),
    });
