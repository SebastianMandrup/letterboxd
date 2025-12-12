import type ListDto from './ListDto';
import type ReviewDto from './ReviewDto';
import type ViewDto from './ViewDto';

export default interface UserDto {
    id: number;
    username: string;
    password?: string;
    role: string;
    email: string;
    createdAt?: string;
    bio?: string;

    lists?: ListDto[];
    reviews?: ReviewDto[];
    views?: ViewDto[];

    numberOfReviews?: number;
    numberOfWatchedFilms?: number;
    reviewLikeCount?: number;

    isFollowed: boolean;
}
