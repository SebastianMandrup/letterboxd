import { useQuery } from '@tanstack/react-query';

import ms from 'ms';
import type PaginatedResponse from '../../DTO/PaginatedResponse';
import type ReviewDto from '../../DTO/ReviewDto';
import ReviewClient from '../../clients/ReviewClient';
import popularReviewsThisWeek from '../../data/popularReviewsThisWeek';

export default () =>
    useQuery<PaginatedResponse<ReviewDto>, Error>({
        queryKey: ['popular-reviews-this-week'],
        queryFn: () => ReviewClient.getAll({ params: { featured: true, pageSize: 6 } }),
        initialData: popularReviewsThisWeek,
        staleTime: ms('2 hours'),
        gcTime: ms('4 hours'),
    });
