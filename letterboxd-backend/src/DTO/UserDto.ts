import { User } from '../entities/User';

export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: string;
}

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}
