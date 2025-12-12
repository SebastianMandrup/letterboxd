import { useQuery } from '@tanstack/react-query';
import type MovieDto from '../../DTO/MovieDto';
import type PaginatedResponse from '../../DTO/PaginatedResponse';
import ms from 'ms';
import MovieClient from '../../clients/MovieClient';

export default () =>
    useQuery<PaginatedResponse<MovieDto>, Error>({
        queryKey: ['just-reviewed-movies'],
        queryFn: () => MovieClient.getAll({ params: { justReviewed: true, pageSize: 22 } }),
        staleTime: ms('6 hours'),
        gcTime: ms('6 hours'),
    });
