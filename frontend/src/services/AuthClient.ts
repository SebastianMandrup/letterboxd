import axios from 'axios';
import type UserDto from '../DTO/UserDto';

export interface PaginatedUserResponse {
  count: number;
  previous?: string | null;
  next?: string | null;
  results: UserDto[];
}

const axiosInstance = axios.create({
  baseURL: import.meta.env['VITE_API_URL'] + '/auth',
});

class AuthClient {
  me = () => axiosInstance.get<UserDto>('/me').then((res) => res.data);

  login = (data: { username: string; password: string }) =>
    axiosInstance
      .post<{
        message: string;
        user: UserDto;
      }>('/login', data)
      .then((res) => res.data);

  logout = () => axiosInstance.post('/logout').then((res) => res.data);
}

export default AuthClient;
