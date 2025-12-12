import { useQuery } from '@tanstack/react-query';

import ms from 'ms';
import type PaginatedResponse from '../../DTO/PaginatedResponse';
import popularReviewers from '../../data/popularReviewers';
import UserClient from '../../clients/UserClient';
import type UserDto from '../../DTO/UserDto';

export default () =>
    useQuery<PaginatedResponse<UserDto>, Error>({
        queryKey: ['popular-reviewers'],
        queryFn: () => UserClient.getAll({ params: { filterBy: 'popularReviewers', pageSize: 5 } }),
        initialData: popularReviewers,
        staleTime: ms('2 hours'),
        gcTime: ms('4 hours'),
    });
