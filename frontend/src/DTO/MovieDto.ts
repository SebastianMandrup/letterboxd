import type ListDto from './ListDto';
import type ReviewDto from './ReviewDto';

export default interface MovieDto {
    id: number;
    title: string;
    originalTitle?: string | null;
    adult: boolean;
    genreIds?: number[] | null;
    overview?: string | null;
    popularity?: number | null;
    posterPath?: string | null;
    backdropPath?: string | null;
    releaseDate?: string | Date;
    voteAverage?: number | null;
    voteCount?: number | null;
    likeCount?: number | null;
    viewCount?: number | null;
    isViewed?: boolean;

    reviews?: ReviewDto[];
    lists?: ListDto[];
}
