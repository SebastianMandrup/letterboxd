import { useQuery } from '@tanstack/react-query';
import UserClient from '../../clients/UserClient';

const useFollowing = (username: string) => {
    return useQuery({
        queryKey: ['following', username],
        queryFn: () => UserClient.getFollowing(username),
        enabled: !!username,
    });
};

export default useFollowing;
