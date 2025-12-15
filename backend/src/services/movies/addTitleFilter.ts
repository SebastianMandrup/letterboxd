import { SelectQueryBuilder } from 'typeorm';
import { Movie } from '../../entities/Movie';

export default function addTitleFilter(queryBuilder: SelectQueryBuilder<Movie>, title: string | undefined) {
    if (!title) return;

    const decodedTitle = decodeURIComponent(title);
    const cleanedTitle = decodedTitle.replace(/[-\s]+/g, ' ').trim();

    queryBuilder.andWhere('movie.title LIKE :title', {
        title: `%${cleanedTitle}%`,
    });
}
