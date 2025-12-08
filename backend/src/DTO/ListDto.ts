import type MovieDto from './MovieDto';

export default interface ListDto {
    id: number;
    name: string;
    author: string;
    description?: string | null;

    movieIds?: number[];
    movies: MovieDto[];
    likeCount: number;
}
