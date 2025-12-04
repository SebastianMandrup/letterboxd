import useMovies from '../../../hooks/useMovies';
import { getMediumPoster } from '../../../services/getMediumPoster';
import ArticleFeaturedMovie from './ArticleFeaturedMovie';
import styles from './sectionFeaturedMovies.module.css';

const SectionFeaturedMovies = () => {
    const { data, error, isLoading } = useMovies({
        params: { featured: true },
    });

    if (data) {
        console.log('Featured movies data:', data);
    }

    return (
        <section id={styles.sectionFeaturedMovies}>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error loading featured movies.</p>}
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
