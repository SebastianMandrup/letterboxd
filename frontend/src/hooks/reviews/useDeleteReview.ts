import { useMutation } from '@tanstack/react-query';
import ReviewClient from '../../clients/ReviewClient';

export default () => {
    return useMutation({
        mutationFn: (reviewId: number) => ReviewClient.deleteReview(reviewId),
    });
};
