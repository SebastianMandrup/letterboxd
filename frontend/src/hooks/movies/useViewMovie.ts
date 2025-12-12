import { useMutation } from '@tanstack/react-query';
import MovieClient from '../../clients/MovieClient';

export default () => {
    return useMutation({
        mutationFn: (movieId: number) => MovieClient.viewMovie(movieId),
    });
};
