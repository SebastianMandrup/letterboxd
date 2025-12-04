import { SelectQueryBuilder } from 'typeorm';
import { Movie } from '../../entities/Movie';

export default function addCrewPicksFilter(queryBuilder: SelectQueryBuilder<Movie>, crewPicks: boolean | undefined) {
    if (crewPicks === true) {
        const CREW_PICKS_MOVIE_IDS = [11, 21, 31, 41, 51, 61];
        queryBuilder.where('movie.id IN (:...ids)', {
            ids: CREW_PICKS_MOVIE_IDS,
        });
    }
}
