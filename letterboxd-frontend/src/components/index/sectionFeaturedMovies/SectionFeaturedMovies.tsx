import useFeaturedMovies from '../../../hooks/useFeaturedMovies';
import ArticleFeaturedMovie from './ArticleFeaturedMovie';
import styles from './sectionFeaturedMovies.module.css';

const SectionFeaturedMovies = () => {

    const { data, error, isLoading } = useFeaturedMovies();

    console.log("Featured Movies Data:", data);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data) {
        return <div>No featured movies available.</div>;
    }

    return (
        <section id={styles.sectionFeaturedMovies}>
            {(data?.results ?? []).map((movie, index) => (
                <ArticleFeaturedMovie
                    key={index}
                    src={movie.posterUrl ?? ''}
                    alt={`post of ${movie.title}`}
                    viewCount={5000} // Placeholder
                    likeCount={1000} // Placeholder
                />
            ))}
        </section>
    );

}

export default SectionFeaturedMovies;