import ApiClient from './apiClient';
import type ListDto from '../DTO/ListDto';

class ListClient extends ApiClient<ListDto> {
    constructor() {
        super('/lists');
    }

    getByName(name: string) {
        return this.axiosInstance.get<ListDto>(`${this.endpoint}/${encodeURIComponent(name)}`).then((res) => res.data);
    }
}

export default new ListClient();
