import ApiClient from './apiClient';
import type UserDto from '../DTO/UserDto';
import type CreateUserDto from '../DTO/CreateUserDto';

export default new ApiClient<UserDto, CreateUserDto>('/users');
