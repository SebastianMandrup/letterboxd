import { useQuery } from '@tanstack/react-query';

import ms from 'ms';
import type PaginatedResponse from '../../DTO/PaginatedResponse';
import type ListDto from '../../DTO/ListDto';
import ListClient from '../../clients/ListClient';
import popularLists from '../../data/popularLists';

export default () =>
    useQuery<PaginatedResponse<ListDto>, Error>({
        queryKey: ['popular-lists-this-week'],
        queryFn: () => ListClient.getAll({ params: { sortBy: 'popularity', pageSize: 3 } }),
        initialData: popularLists,
        staleTime: ms('2 hours'),
        gcTime: ms('4 hours'),
    });
