import type ListDto from './ListDto';
import type ReviewDto from './ReviewDto';

export default interface Movie {
  id: number;
  title: string;
  originalTitle?: string | null;
  adult: boolean;
  genreIds?: number[] | null;
  overview?: string | null;
  popularity?: number | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  releaseDate?: string | Date;
  voteAverage?: number | null;
  voteCount?: number | null;

  reviews: ReviewDto[];
  lists: ListDto[];
}
