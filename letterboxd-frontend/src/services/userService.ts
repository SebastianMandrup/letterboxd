import ApiClient from './ApiClient';
import type UserDto from '../DTO/userDto';
import type CreateUserDto from '../DTO/CreateUserDto';

export default new ApiClient<UserDto, CreateUserDto>('/users');
