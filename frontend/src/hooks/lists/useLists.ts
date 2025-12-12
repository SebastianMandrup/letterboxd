import { useQuery } from '@tanstack/react-query';

import type { AxiosRequestConfig } from 'axios';
import ms from 'ms';
import type ListDto from '../../DTO/ListDto';
import type PaginatedResponse from '../../DTO/PaginatedResponse';
import ListClient from '../../clients/ListClient';

export default (config: AxiosRequestConfig) =>
    useQuery<PaginatedResponse<ListDto>, Error>({
        queryKey: ['lists', config],
        queryFn: () => ListClient.getAll(config),
        staleTime: ms('24 hours'),
        gcTime: ms('24 hours'),
    });
