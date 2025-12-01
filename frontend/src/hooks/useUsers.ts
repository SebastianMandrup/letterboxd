import { useQuery } from '@tanstack/react-query';

import type { AxiosRequestConfig } from 'axios';
import ms from 'ms';
import type PaginatedResponse from '../DTO/PaginatedResponse';
import type UserDto from '../DTO/UserDto';
import userService from '../services/userService';

export default (config: AxiosRequestConfig) =>
  useQuery<PaginatedResponse<UserDto>, Error>({
    queryKey: ['users', config],
    queryFn: () => userService.getAll(config),
    // initialData: featuredUsers,
    staleTime: ms('24 hours'),
    gcTime: ms('24 hours'),
  });
