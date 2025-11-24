import useMovies from '../../hooks/useMovies';
import { getMediumPoster } from '../../services/getMediumPoster';
import ArticleMovie from '../shared/movieCard/MovieCard';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import styles from './popularMovies.module.css';

const PopularMovies = () => {

    const { data, error, isLoading } = useMovies({
        params: { popularThisWeek: true }
    })

    return (
        <section className={styles.sectionPopularMovies}>
            <SectionHeader title="Popular Movies" link="/films/popular" />
            <section>
                {isLoading && <div>Loading...</div>}
                {error && <div>Error loading popular movies.</div>}
                {data &&
                    <ul className={styles.ulPopularMovies}>
                        {data.results.map((movie) => (
                            <li key={movie.id} className={styles.liTopMovies}>
                                <ArticleMovie key={movie.id} title={movie.title} src={getMediumPoster(movie.posterUrl)} alt='' />
                            </li>
                        ))}
                    </ul>
                }
            </section>
            <img className={styles.imgAd} src="https://a.ltrbxd.com/sm/upload/lz/cd/q9/26/pro-950.png?k=c065ade008" alt="AD" />
        </section>
    );
}

export default PopularMovies;