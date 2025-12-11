import type FollowDto from '../DTO/FollowDto';
import type UserDto from '../DTO/UserDto';
import ApiClient from './apiClient';
import type ApiResponse from './ApiResponse.interface';

export class UserClient extends ApiClient<UserDto> {
    constructor() {
        super('/users');
    }

    getByUsername = (username: string) => this.axiosInstance.get<UserDto>(`${this.endpoint}/${encodeURIComponent(username)}`).then((res) => res.data);

    getFollowers = (username: string) => {
        return this.axiosInstance.get<FollowDto[]>(`${this.endpoint}/${encodeURIComponent(username)}/followers`).then((res) => res.data);
    };

    getFollowing = (username: string) => {
        return this.axiosInstance.get<FollowDto[]>(`${this.endpoint}/${encodeURIComponent(username)}/following`).then((res) => res.data);
    };

    followUser = (userId: number) => {
        return this.axiosInstance.post<ApiResponse<null>>(`${this.endpoint}/${userId}/follow`).then((res) => res.data);
    };
}
