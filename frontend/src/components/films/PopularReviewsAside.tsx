import type { FunctionComponent } from 'react';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import useMovies from '../../hooks/useMovies';
import MovieCard from '../shared/movieCard/MovieCard';
import { getThumbnailPoster } from '../../services/getThumbnailPoster';
import styles from './popularReviewsAside.module.css';
import useUsers from '../../hooks/useUsers';
import UserCard from '../shared/userCard/UserCard';

const PopularReviewsAside: FunctionComponent = () => {
  const crewPickMovies = useMovies({
    params: { crewPicks: true, pageSize: 6 },
  });

  const popularReviewers = useUsers({
    params: { filterBy: 'popularReviewers', pageSize: 5 },
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

      <SectionHeader title="popular reviewers" />
      <section>
        {popularReviewers.data?.results.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </section>
    </aside>
  );
};

export default PopularReviewsAside;
