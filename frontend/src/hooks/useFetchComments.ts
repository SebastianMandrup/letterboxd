import { useQuery } from '@tanstack/react-query';

import ms from 'ms';
import listService from '../services/listService';
import type CommentDto from '../DTO/CommentDto';

export default (id: number) =>
    useQuery<CommentDto[], Error>({
        queryKey: ['list', id, 'comments'],
        queryFn: () => listService.getCommentsById(id),
        staleTime: ms('24 hours'),
        gcTime: ms('24 hours'),
    });
