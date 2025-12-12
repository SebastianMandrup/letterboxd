import type FollowDto from '../DTO/FollowDto';
import type PopulatedUserDto from '../DTO/PopulatedUserDto';
import type UserDto from '../DTO/UserDto';
import ApiClient from './apiClient';
import type ApiResponse from './ApiResponse.interface';

class UserClient extends ApiClient<UserDto> {
    private static instance: UserClient;

    private constructor() {
        super('/users');
    }

    public static getInstance(): UserClient {
        if (!UserClient.instance) {
            UserClient.instance = new UserClient();
        }
        return UserClient.instance;
    }

    getByUsername = (username: string) => this.axiosInstance.get<PopulatedUserDto>(`${this.endpoint}/${encodeURIComponent(username)}`).then((res) => res.data);

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

export default UserClient.getInstance();
