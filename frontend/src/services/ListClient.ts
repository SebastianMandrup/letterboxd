import ApiClient from './apiClient';
import type ListDto from '../DTO/ListDto';
import type CommentDto from '../DTO/CommentDto';
import type ApiResponse from './ApiResponse.interface';

class ListClient extends ApiClient<ListDto> {
    private static instance: ListClient;

    private constructor() {
        super('/lists');
    }

    public static getInstance(): ListClient {
        if (!ListClient.instance) {
            ListClient.instance = new ListClient();
        }
        return ListClient.instance;
    }

    getByName(name: string) {
        return this.axiosInstance.get<ListDto>(`${this.endpoint}/${encodeURIComponent(name)}`).then((res) => res.data);
    }

    getCommentsById(id: number) {
        return this.axiosInstance.get<CommentDto[]>(`${this.endpoint}/${id}/comments`).then((res) => res.data);
    }

    addCommentToList(id: number, content: string) {
        return this.axiosInstance.post<ApiResponse<CommentDto>>(`${this.endpoint}/${id}/comments`, { content }).then((res) => res.data);
    }
}

export default ListClient.getInstance();
