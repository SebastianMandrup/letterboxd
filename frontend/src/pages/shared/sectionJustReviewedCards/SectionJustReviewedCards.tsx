import useJustReviewedMovies from '../../../hooks/movies/useJustReviewedMovies';
import { getThumbnailPoster } from '../../../util/getThumbnailPoster';
import LoadingMovieCard from '../movieCard/LoadingMovieCard';
import MovieCard from '../movieCard/MovieCard';
import SectionHeader from '../sectionHeader/SectionHeader';
import styles from './sectionJustReviewedCards.module.css';

function SectionJustReviewedCards() {
    const { data, error, isLoading } = useJustReviewedMovies();

    return (
        <>
            <SectionHeader title="Just Reviewed..." subtitle="2,944,858,769 films watched" />
            <ul className={styles.listJustReviewedCards}>
                {isLoading || error || !data
                    ? Array.from({ length: 14 }).map((_, index) => (
                          <li key={index} className={styles.listItemReviewedMovie}>
                              <LoadingMovieCard />
                          </li>
                      ))
                    : null}
                {data?.results.map((movie, index) => (
                    <li key={index} className={styles.listItemReviewedMovie}>
                        <MovieCard
                            title={movie.title}
                            src={getThumbnailPoster(movie.posterPath)}
                            alt={`Poster of ${movie.title}`}
                            overlay={<header>{movie.title}</header>}
                        />
                    </li>
                ))}
            </ul>
        </>
    );
}

export default SectionJustReviewedCards;
