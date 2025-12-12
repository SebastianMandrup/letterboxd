import useMovies from '../../hooks/movies/useMovies';
import { getMediumPoster } from '../../util/getMediumPoster';
import ArticleMovie from '../shared/movieCard/MovieCard';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import styles from './popularMovies.module.css';

const PopularMovies = () => {
    // TODO: custom hook for initial data?
    const { data, error, isLoading } = useMovies({
        params: { popularThisWeek: true },
    });

    return (
        <section className={styles.sectionPopularMovies}>
            <SectionHeader title="Popular Movies" link="/movies/browse?popular=allTime" />
            <section>
                {isLoading && <div>Loading...</div>}
                {error && <div>Error loading popular movies.</div>}
                {data && (
                    <ul className={styles.ulPopularMovies}>
                        {data.results.map((movie) => (
                            <li key={movie.id} className={styles.liTopMovies}>
                                <ArticleMovie key={movie.id} title={movie.title} src={getMediumPoster(movie.posterPath)} alt="" />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </section>
    );
};

export default PopularMovies;
