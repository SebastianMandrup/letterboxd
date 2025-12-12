import { SelectQueryBuilder } from 'typeorm';
import { Movie } from '../../entities/Movie';

export default function addJustReviewedFilter(queryBuilder: SelectQueryBuilder<Movie>, justReviewed: boolean | undefined) {
    if (justReviewed === true) {
        queryBuilder.leftJoinAndSelect('movie.reviews', 'review').orderBy('review.createdAt', 'DESC');
    }
}
