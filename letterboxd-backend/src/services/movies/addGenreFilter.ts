import { SelectQueryBuilder } from "typeorm";
import { Movie } from "../../entities/Movie";

export default function addGenreFilter(
	queryBuilder: SelectQueryBuilder<Movie>,
	genre: string | undefined
) {
	if (!genre) return;

	queryBuilder
		.leftJoin("movie.genres", "genre")
		.andWhere("genre.name = :genreName", { genreName: genre });
};

const addTitleFilter = (
	queryBuilder: SelectQueryBuilder<Movie>,
	title: string | undefined
) => {

	if (!title) return;

	title = title.replace(/-/g, ' ');

	queryBuilder
		.andWhere("LOWER(movie.title) = :title", { title: title.toLowerCase() })
		.leftJoinAndSelect(
			"movie.reviews",
			"review",
			"review.deletedAt IS NULL"
		)
		.leftJoin(
			"review.author",
			"author"
		)
		.addSelect("author.username")
		.leftJoinAndSelect(
			"movie.lists",
			"list"
		)
};