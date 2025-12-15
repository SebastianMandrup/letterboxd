import { SelectQueryBuilder } from 'typeorm';
import { Movie } from '../../entities/Movie';

export default function addGenreFilter(queryBuilder: SelectQueryBuilder<Movie>, genre: string | undefined) {
    if (!genre) return;

    queryBuilder
        .innerJoin('movie_genre', 'mg', 'mg.movieId = movie.id')
        .innerJoin('genres', 'g', 'g.id = mg.genreId')
        .andWhere('LOWER(g.name) = :genre', { genre: genre.toLowerCase() });
}
