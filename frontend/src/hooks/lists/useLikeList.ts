import { useMutation } from '@tanstack/react-query';
import ListClient from '../../clients/ListClient';

export default () => {
    return useMutation({
        mutationFn: (listId: number) => ListClient.likeList(listId),
    });
};
