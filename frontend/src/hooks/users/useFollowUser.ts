import { useMutation, useQueryClient } from '@tanstack/react-query';
import UserClient from '../../clients/UserClient';

const useFollowUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => UserClient.followUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['followed-users'] });
        },
    });
};

export default useFollowUser;
