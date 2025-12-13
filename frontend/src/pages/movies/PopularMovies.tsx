import useMovies from '../../hooks/movies/useMovies';
import { getMediumPoster } from '../../util/getMediumPoster';
import LoadingMovieCard from '../shared/movieCard/LoadingMovieCard';
import MovieCard from '../shared/movieCard/MovieCard';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import styles from './popularMovies.module.css';

const PopularMovies = () => {
    const { data, error, isLoading } = useMovies({
        params: { popularThisWeek: true },
    });

    return (
        <section className={styles.sectionPopularMovies}>
            <SectionHeader title="Popular Movies" link="/movies/browse?popular=allTime" />
            <section>
                <ul className={styles.ulPopularMovies}>
                    {isLoading || error ? Array.from({ length: 5 }).map((_, index) => <LoadingMovieCard key={index} />) : null}
                    {data &&
                        data.results.map((movie) => (
                            <li key={movie.id} className={styles.liTopMovies}>
                                <MovieCard key={movie.id} title={movie.title} src={getMediumPoster(movie.posterPath)} alt="" />
                            </li>
                        ))}
                </ul>
            </section>
        </section>
    );
};

export default PopularMovies;
