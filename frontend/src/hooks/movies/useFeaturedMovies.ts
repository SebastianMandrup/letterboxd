import { useQuery } from '@tanstack/react-query';

import ms from 'ms';
import type MovieDto from '../../DTO/MovieDto';
import type PaginatedResponse from '../../DTO/PaginatedResponse';
// import featuredMovies from '../../data/featuredMovies';
import MovieClient from '../../clients/MovieClient';

export default () =>
    useQuery<PaginatedResponse<MovieDto>, Error>({
        queryKey: ['featured-movies'],
        queryFn: () => MovieClient.getAll({ params: { featured: true, pageSize: 6 } }),
        // initialData: featuredMovies,
        staleTime: ms('24 hours'),
        gcTime: ms('24 hours'),
    });
