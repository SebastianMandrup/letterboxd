import type { FunctionComponent } from 'react';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import useMovies from '../../hooks/useMovies';
import MovieCard from '../shared/movieCard/MovieCard';
import { getThumbnailPoster } from '../../services/getThumbnailPoster';
import styles from './popularReviewsAside.module.css';
import SectionPopularReviewers from '../shared/sectionPopularReviewers/SectionPopularReviewers';

const PopularReviewsAside: FunctionComponent = () => {
  const crewPickMovies = useMovies({
    params: { crewPicks: true, pageSize: 6 },
  });

  return (
    <aside>
      <SectionHeader title="crew picks" />
      <section className={styles.sectionCrewPicks}>
        {crewPickMovies.data?.results.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            src={getThumbnailPoster(movie.posterUrl)}
            alt={movie.title}
          />
        ))}
      </section>

      <SectionPopularReviewers />

      <SectionHeader title="CAN'T FIND A FILM?" />
      <section className={styles.sectionCantFindFilm}>
        <p>Help keep boxxedletter up to date</p>
        <p>
          Find out how to
          <a href="/add-film">add or edit a film</a>
        </p>
      </section>
    </aside>
  );
};

export default PopularReviewsAside;
