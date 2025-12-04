import { SelectQueryBuilder } from 'typeorm';
import { Movie } from '../../entities/Movie';

export default function addGenreFilter(queryBuilder: SelectQueryBuilder<Movie>, genre: string | undefined) {
    if (!genre) return;

    queryBuilder.leftJoin('movie.genres', 'genre').andWhere('genre.name = :genreName', { genreName: genre });
}
