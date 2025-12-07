import listService from '../services/listService';

export default async (listId: number, commentText: string) => {
    return await listService.addCommentToList(listId, commentText);
};
