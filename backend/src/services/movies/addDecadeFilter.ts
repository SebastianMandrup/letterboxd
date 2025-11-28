import { SelectQueryBuilder } from 'typeorm';
import { Movie } from '../../entities/Movie';

export default function addDecadeFilter(
  queryBuilder: SelectQueryBuilder<Movie>,
  decade: string | undefined,
) {
  if (!decade) return;

  if (decade === 'upcoming') {
    const currentDate = new Date();
    queryBuilder.andWhere('movie.releaseDate > :currentDate', {
      currentDate: currentDate.toISOString().split('T')[0],
    });
    return;
  }

  decade = decade.replace('s', '');
  const startYear = parseInt(decade);
  const endYear = startYear + 9;
  queryBuilder.andWhere('movie.releaseDate BETWEEN :startDate AND :endDate', {
    startDate: `${startYear}-01-01`,
    endDate: `${endYear}-12-31`,
  });
}
