import { useMutation, useQueryClient } from "@tanstack/react-query";
import movieService from '../services/movieService';

const useDeleteMovie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (movieId: number) => movieService.delete(movieId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movies"] });
        },
    });
};

export default useDeleteMovie;