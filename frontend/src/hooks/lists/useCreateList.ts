import { useMutation } from '@tanstack/react-query';
import ListClient from '../../clients/ListClient';

export default () => {
    return useMutation({
        mutationFn: (data: { name: string; description: string; movieIds: number[] }) => ListClient.create(data),
    });
};
