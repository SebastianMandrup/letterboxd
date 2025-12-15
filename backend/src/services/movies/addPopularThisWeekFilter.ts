import { SelectQueryBuilder } from 'typeorm';
import { Movie } from '../../entities/Movie';

export default (queryBuilder: SelectQueryBuilder<Movie>, popularThisWeek: boolean | undefined) => {
    if (popularThisWeek === true) {
        queryBuilder.orderBy('movie.vote_average', 'DESC').take(12);
    }
};
