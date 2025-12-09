import type ListDto from './ListDto';
import type ReviewDto from './ReviewDto';
import type ViewDto from './ViewDto';

export default interface PopulatedUserDto {
    id: number;
    username: string;
    role: string;
    email: string;
    createdAt: string;
    bio?: string;

    isFollowed: boolean;

    lists: ListDto[];
    reviews: ReviewDto[];
    views: ViewDto[];
}
