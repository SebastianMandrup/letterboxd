import type MovieDto from './MovieDto';

export default interface ViewDto {
    id: number;
    viewedAt: Date;

    movie: MovieDto;
}
