import { useMutation, useQueryClient } from '@tanstack/react-query';
import UserClient from '../../services/UserClient';

const useFollowUser = (userId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => UserClient.followUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['followed-users'] });
        },
    });
};

export default useFollowUser;
