import { useQuery } from '@tanstack/react-query';
import UserClient from '../clients/UserClient';

const useFollowers = (username: string) => {
    return useQuery({
        queryKey: ['followers', username],
        queryFn: () => UserClient.getFollowers(username),
        enabled: !!username,
    });
};

export default useFollowers;
