import { useQuery } from '@tanstack/react-query';

import ms from 'ms';
import movieService from '../services/movieService';
import type Movie from '../DTO/MovieDto';

export default (title: string) =>
  useQuery<Movie, Error>({
    queryKey: ['movies', title],
    queryFn: () => movieService.getByTitle(title),
    // initialData: featuredMovies,
    staleTime: ms('24 hours'),
    gcTime: ms('24 hours'),
  });
