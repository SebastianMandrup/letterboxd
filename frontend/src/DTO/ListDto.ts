import type MovieDto from './MovieDto';

export default interface ListDto {
    id: number;
    name: string;
    user: {
        username: string;
    };
    description: string;

    movies: MovieDto[];
    likeCount: number;
    commentCount: number;
}
