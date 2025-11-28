import { SelectQueryBuilder } from "typeorm";
import { Movie } from "../../entities/Movie";

export default function addTitleFilter(
	queryBuilder: SelectQueryBuilder<Movie>,
	title: string | undefined
) {
	if (!title) return;

	const decodedTitle = decodeURIComponent(title);
	const cleanedTitle = decodedTitle
		.replace(/[-\s]+/g, ' ')  // Replace hyphens and multiple spaces with single space
		.trim();

	queryBuilder.andWhere("movie.title LIKE :title", { title: `%${cleanedTitle}%` });
}