import { Movie } from '../entities/Movie';
import { User } from '../entities/User';

export interface UserWithCountDto {
    id: number;
    username: string;
    email: string;
    role: string;
    numberOfReviews: number;
    numberOfWatchedFilms: number;
    reviewLikeCount: number;
    recentlyWatchedMovies?: Movie[];
}

export function toUserWithCountDto(user: User): UserWithCountDto {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        numberOfReviews: user.numberOfReviews ?? 0,
        numberOfWatchedFilms: user.numberOfWatchedFilms ?? 0,
        reviewLikeCount: user.reviewLikeCount ?? 0,
        recentlyWatchedMovies: user.recentlyWatchedMovies ?? [],
    };
}
