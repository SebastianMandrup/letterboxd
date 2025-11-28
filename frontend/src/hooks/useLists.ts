import { useQuery } from '@tanstack/react-query';

import type { AxiosRequestConfig } from 'axios';
import ms from 'ms';
import type ListDto from '../DTO/ListDto';
import type PaginatedResponse from '../DTO/PaginatedResponse';
import listService from '../services/listService';

export default (config: AxiosRequestConfig) =>
  useQuery<PaginatedResponse<ListDto>, Error>({
    queryKey: ['lists', config],
    queryFn: () => listService.getAll(config),
    // initialData: featuredLists,
    staleTime: ms('24 hours'),
    gcTime: ms('24 hours'),
  });
