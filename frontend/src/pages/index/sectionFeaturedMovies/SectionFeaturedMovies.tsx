import useFeaturedMovies from '../../../hooks/movies/useFeaturedMovies';
import { getMediumPoster } from '../../../util/getMediumPoster';
import LoadingMovieCard from '../../shared/movieCard/LoadingMovieCard';
import ArticleFeaturedMovie from './ArticleFeaturedMovie';
import styles from './sectionFeaturedMovies.module.css';

const SectionFeaturedMovies = () => {
    const { data, error, isLoading } = useFeaturedMovies();

    return (
        <section id={styles.sectionFeaturedMovies}>
            {(error || isLoading) && Array.from({ length: 6 }).map((_, index) => <LoadingMovieCard key={index} />)}

            {data &&
                (data.results ?? []).map((movie, index) => (
                    <ArticleFeaturedMovie
                        title={movie.title}
                        key={index}
                        src={getMediumPoster(movie.posterPath)}
                        alt={`post of ${movie.title}`}
                        viewCount={movie.viewCount ?? 0}
                        likeCount={movie.likeCount ?? 0}
                    />
                ))}
        </section>
    );
};

export default SectionFeaturedMovies;
