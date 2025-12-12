import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import type Movie from '../../DTO/MovieDto';
import MovieClient from '../../clients/MovieClient';

export default (title: string) =>
    useQuery<Movie, Error>({
        queryKey: ['movies', title],
        queryFn: () => MovieClient.getByTitle(title),
        staleTime: ms('24 hours'),
        gcTime: ms('24 hours'),
    });
