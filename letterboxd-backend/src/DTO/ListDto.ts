import type MovieDto from './MovieDto';

export default interface ListDto {
  id: number;
  name: string;
  author: string;
  description?: string | null;

  movies: MovieDto[];
  likeCount: number;
}
