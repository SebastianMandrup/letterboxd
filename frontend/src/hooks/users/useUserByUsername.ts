import { useQuery } from '@tanstack/react-query';
import ms from 'ms';
import type PopulatedUserDto from '../../DTO/PopulatedUserDto';
import UserClient from '../../clients/UserClient';

export default (username: string) =>
    useQuery<PopulatedUserDto, Error>({
        queryKey: ['users', username],
        queryFn: () => UserClient.getByUsername(username),
        staleTime: ms('24 hours'),
        gcTime: ms('24 hours'),
    });
