import { useQuery } from '@tanstack/react-query';

import ms from 'ms';
import type ListDto from '../DTO/ListDto';
import ListClient from '../clients/ListClient';

export default (name: string) =>
    useQuery<ListDto, Error>({
        queryKey: ['list', name],
        queryFn: () => ListClient.getByName(name),
        staleTime: ms('24 hours'),
        gcTime: ms('24 hours'),
    });
