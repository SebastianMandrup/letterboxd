import { SelectQueryBuilder } from "typeorm";
import { Movie } from "../../entities/Movie";

export default function addFeaturedFilter(
	queryBuilder: SelectQueryBuilder<Movie>,
	featured: boolean | undefined
) {
	if (featured === true) {
		const FEATURED_MOVIE_IDS = [10, 20, 30, 40, 50, 60];
		queryBuilder.where("movie.id IN (:...ids)", { ids: FEATURED_MOVIE_IDS });
	}
};