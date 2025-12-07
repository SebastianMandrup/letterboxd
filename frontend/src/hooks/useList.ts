import { useQuery } from '@tanstack/react-query';

import ms from 'ms';
import type ListDto from '../DTO/ListDto';
import listService from '../services/listService';

export default (name: string) =>
    useQuery<ListDto, Error>({
        queryKey: ['list', name],
        queryFn: () => listService.getByName(name),
        staleTime: ms('24 hours'),
        gcTime: ms('24 hours'),
    });
