import useMovies from '../../../hooks/useMovies';
import { getMediumPoster } from '../../../services/getMediumPoster';
import ArticleFeaturedMovie from './ArticleFeaturedMovie';
import styles from './sectionFeaturedMovies.module.css';

const SectionFeaturedMovies = () => {
  const { data, error, isLoading } = useMovies({
    params: { featured: true },
  });
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
          viewCount={5000} // Placeholder
          likeCount={1000} // Placeholder
        />
      ))}
    </section>
  );
};

export default SectionFeaturedMovies;
