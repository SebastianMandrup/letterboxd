import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import type MovieDto from '../../DTO/MovieDto';
import MovieClient from '../../clients/MovieClient';

export default (partialSlug: string) =>
    useQuery<MovieDto[], Error>({
        queryKey: ['movies-by-partial-slug', partialSlug],
        queryFn: () => MovieClient.getByPartialSlug(partialSlug),
        staleTime: ms('24 hours'),
        gcTime: ms('24 hours'),
        enabled: partialSlug.length > 2,
    });
