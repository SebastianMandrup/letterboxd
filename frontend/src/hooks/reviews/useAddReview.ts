import { useMutation } from '@tanstack/react-query';
import ReviewClient from '../../clients/ReviewClient';

export default () => {
    return useMutation({
        mutationFn: (data: { review: string; rating: number; movieId: number; isLiked: boolean }) => ReviewClient.create(data),
    });
};
