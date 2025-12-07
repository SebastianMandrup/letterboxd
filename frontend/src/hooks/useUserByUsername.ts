import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import userService from '../services/userService';
import type PopulatedUserDto from '../DTO/PopulatedUserDto';

export default (username: string) =>
    useQuery<PopulatedUserDto, Error>({
        queryKey: ['users', username],
        queryFn: () => userService.getByUsername(username),
        staleTime: ms('24 hours'),
        gcTime: ms('24 hours'),
    });
