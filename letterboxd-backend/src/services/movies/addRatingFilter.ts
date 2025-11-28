import { SelectQueryBuilder } from 'typeorm';
import { Movie } from '../../entities/Movie';

export default function addRatingFilter(
  queryBuilder: SelectQueryBuilder<Movie>,
  rating: string | undefined,
) {
  if (!rating) return;

  if (rating === 'lowest') {
    queryBuilder.orderBy('movie.voteAverage', 'ASC');
    return;
  }

  if (rating === 'highest') {
    queryBuilder.orderBy('movie.voteAverage', 'DESC');
    return;
  }
}
