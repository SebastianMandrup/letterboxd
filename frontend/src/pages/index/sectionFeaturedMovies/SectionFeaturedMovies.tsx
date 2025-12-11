import useMovies from '../../../hooks/useMovies';
import { getMediumPoster } from '../../../services/getMediumPoster';
import LoadingMovieCard from '../../shared/movieCard/LoadingMovieCard';
import ArticleFeaturedMovie from './ArticleFeaturedMovie';
import styles from './sectionFeaturedMovies.module.css';

const SectionFeaturedMovies = () => {
    const { data, error, isLoading } = useMovies({
        params: { featured: true },
    });

    return (
        <section id={styles.sectionFeaturedMovies}>
            {error && <p>Error loading featured movies.</p>}

            {isLoading && Array.from({ length: 6 }).map((_, index) => <LoadingMovieCard key={index} />)}

            {(data?.results ?? []).map((movie, index) => (
                <ArticleFeaturedMovie
                    title={movie.title}
                    key={index}
                    src={getMediumPoster(movie.posterUrl)}
                    alt={`post of ${movie.title}`}
                    viewCount={movie.viewCount ?? 0}
                    likeCount={movie.likeCount ?? 0}
                />
            ))}
        </section>
    );
};

export default SectionFeaturedMovies;
