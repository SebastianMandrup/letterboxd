import useMovies from '../../hooks/useMovies';
import ArticleMovie from '../shared/ArticleMovie';
import SectionHeader from '../shared/SectionHeader';
import styles from './popularMovies.module.css';

const PopularMovies = () => {

    const { data, error, isLoading } = useMovies({
        params: { popularThisWeek: true }
    })

    return (
        <section className={styles.sectionPopularFilms}>
            <SectionHeader title="Popular Films" link="/films/popular" />
            <section className={styles.sectionPopularFilmsThisWeek}>
                {isLoading && <div>Loading...</div>}
                {error && <div>Error loading popular films.</div>}
                {data &&
                    <ul className={styles.ulPopularFilms}>
                        {data.results.map((movie) => (
                            <li key={movie.id} className={styles.liTopMovies}>
                                <ArticleMovie key={movie.id} src={movie.posterUrl || ''} alt='' />
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