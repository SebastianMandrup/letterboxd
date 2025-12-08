import type MovieDto from './MovieDto';

export default interface ListDto {
    id: number;
    name: string;
    description: string;
    user: {
        username: string;
    };

    movieIds?: number[];
    movies: MovieDto[];
    likeCount: number;
    commentCount: number;
    createdAt: string;
}
