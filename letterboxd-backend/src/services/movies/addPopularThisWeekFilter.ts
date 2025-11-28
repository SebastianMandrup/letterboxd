import { SelectQueryBuilder } from "typeorm";
import { Movie } from "../../entities/Movie";

export default (
	queryBuilder: SelectQueryBuilder<Movie>,
	popularThisWeek: boolean | undefined
) => {
	if (popularThisWeek === true) {
		queryBuilder
			.orderBy("movie.voteAverage", "DESC")
			.take(12);
	}
};