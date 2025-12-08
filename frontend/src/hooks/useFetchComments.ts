import { useQuery } from '@tanstack/react-query';

import ms from 'ms';
import ListClient from '../services/ListClient';
import type CommentDto from '../DTO/CommentDto';

export default (id: number) =>
    useQuery<CommentDto[], Error>({
        queryKey: ['list', id, 'comments'],
        queryFn: () => ListClient.getCommentsById(id),
        staleTime: ms('24 hours'),
        gcTime: ms('24 hours'),
    });
