import ApiClient from './apiClient';
import type ListDto from '../DTO/ListDto';
import type CommentDto from '../DTO/CommentDto';

class ListClient extends ApiClient<ListDto> {
    constructor() {
        super('/lists');
    }

    getByName(name: string) {
        return this.axiosInstance.get<ListDto>(`${this.endpoint}/${encodeURIComponent(name)}`).then((res) => res.data);
    }

    getCommentsById(id: number) {
        return this.axiosInstance.get<CommentDto[]>(`${this.endpoint}/${id}/comments`).then((res) => res.data);
    }

    addCommentToList(id: number, content: string) {
        return this.axiosInstance.post(`${this.endpoint}/${id}/comments`, { content }).then((res) => res.data);
    }
}

export default new ListClient();
