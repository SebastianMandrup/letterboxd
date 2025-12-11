import { useQuery } from '@tanstack/react-query';
import userService from '../services/userService';

const useFollowing = (username: string) => {
    return useQuery({
        queryKey: ['following', username],
        queryFn: () => userService.getFollowing(username),
        enabled: !!username,
    });
};

export default useFollowing;
