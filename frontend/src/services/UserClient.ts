import type UserDto from '../DTO/UserDto';
import ApiClient from './apiClient';
import type ApiResponse from './ApiResponse.interface';

export class UserClient extends ApiClient<UserDto> {
    constructor() {
        super('/users');
    }

    getByUsername = (username: string) => this.axiosInstance.get<UserDto>(`${this.endpoint}/${encodeURIComponent(username)}`).then((res) => res.data);

    followUser = (userId: number) => {
        return this.axiosInstance.post<ApiResponse<null>>(`${this.endpoint}/${userId}/follow`).then((res) => res.data);
    };
}
