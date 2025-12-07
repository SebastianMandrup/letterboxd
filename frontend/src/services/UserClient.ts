import type UserDto from '../DTO/UserDto';
import ApiClient from './apiClient';

export class UserClient extends ApiClient<UserDto> {
    constructor() {
        super('/users');
    }

    getByUsername = (username: string) => this.axiosInstance.get<UserDto>(`${this.endpoint}/${encodeURIComponent(username)}`).then((res) => res.data);
}
