import { useQuery } from '@tanstack/react-query';

import type { AxiosRequestConfig } from 'axios';
import ms from 'ms';
import type PaginatedResponse from '../../DTO/PaginatedResponse';
import type ReviewDto from '../../DTO/ReviewDto';
import reviewService from '../../clients/ReviewClient';

export default (config: AxiosRequestConfig) =>
    useQuery<PaginatedResponse<ReviewDto>, Error>({
        queryKey: ['reviews', config],
        queryFn: () => reviewService.getAll(config),
        // initialData: featuredUsers,
        staleTime: ms('24 hours'),
        gcTime: ms('24 hours'),
    });
