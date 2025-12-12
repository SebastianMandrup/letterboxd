import { useMutation } from '@tanstack/react-query';
import ListClient from '../../clients/ListClient';

export default (listId: number) => {
    return useMutation({
        mutationFn: (commentContent: string) => ListClient.addCommentToList(listId, commentContent),
    });
};
