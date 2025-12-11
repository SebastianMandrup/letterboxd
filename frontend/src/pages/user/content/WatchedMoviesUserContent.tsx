import type { FunctionComponent } from 'react';
import type ViewDto from '../../../DTO/ViewDto';
import SectionHeader from '../../../components/shared/sectionHeader/SectionHeader';
import MovieCard from '../../../components/shared/movieCard/MovieCard';
import { getMediumPoster } from '../../../services/getMediumPoster';
import styles from './watchedMoviesUserContent.module.css';

interface WatchedMoviesProps {
    views: ViewDto[];
}

const WatchedMovies: FunctionComponent<WatchedMoviesProps> = ({ views }) => {
    return (
        <section>
            <SectionHeader title="Watched Movies" />
            {views.length === 0 ? (
                <p>This user has not watched any movies yet.</p>
            ) : (
                <ul className={styles.movieList}>
                    {views.map((view) => (
                        <li key={view.movie.id} className={styles.movieListItem}>
                            <MovieCard title={view.movie.title} src={getMediumPoster(view.movie.posterUrl)} alt={view.movie.title} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default WatchedMovies;
