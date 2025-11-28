import { useParams } from 'react-router-dom';
import Backdrop from '../components/index/backdrop/Backdrop';
import ArticleMovie from '../components/shared/movieCard/MovieCard';
import SectionHeader from '../components/shared/sectionHeader/SectionHeader';
import useMovies from '../hooks/useMovies';
import { getMediumPoster } from '../services/getMediumPoster';
import styles from './moviePage.module.css';

function MoviePage() {
  const title = useParams().title;

  const { data, error, isLoading } = useMovies({
    params: {
      title: title,
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading movie.</p>;
  }

  const movie = data?.results[0];

  if (!movie) return null;
  return (
    <>
      {movie.backdropUrl ? (
        <Backdrop src={movie.backdropUrl || ''} alt={movie.title} caption="" />
      ) : (
        <Backdrop src="/default-backdrop.jpg" alt={movie.title} caption="" />
      )}

      <section className={styles.sectionMovieDetails}>
        <section className={styles.sectionPoster}>
          <ArticleMovie
            title={movie.title}
            src={getMediumPoster(movie.posterUrl)}
            alt={'poster of ' + movie.title}
          />
        </section>
        <section className={styles.sectionMain}>
          <section className={styles.sectionFirstContent}>
            <section className={styles.sectionLeft}>
              <header className={styles.headerMovieDetails}>
                <h1 className={styles.h1MovieTitle}>{movie.title}</h1>
                <p className={styles.pReleaseYear}>
                  {data.results[0].releaseDate?.toString().split('-')[0] || ''}
                </p>
              </header>
              <p className={styles.pMovieOverview}>{movie.overview}</p>
            </section>
            <section className={styles.sectionRight}>
              <div className={styles.divButtonsMoviePage}>
                <button className={styles.buttonLogRateReview}>
                  Sign in to log, rate or review
                </button>
                <button className={styles.buttonShareMovie}>Share</button>
              </div>
            </section>
          </section>
          <section>
            <SectionHeader
              title="Popular Reviews"
              subtitle="MORE"
              link="./reviews"
            />
            {movie.reviews && movie.reviews.length > 0 ? (
              <section className={styles.sectionReviews}>
                {movie.reviews.map((review) => (
                  <article key={review.id} className={styles.articleReview}>
                    <p className={styles.pReviewContent}>{review.review}</p>
                    <p className={styles.pReviewAuthor}>
                      - {review.author.name}
                    </p>
                  </article>
                ))}
              </section>
            ) : (
              <p>No reviews available.</p>
            )}
          </section>
          <section>
            <SectionHeader
              title="Popular Lists"
              subtitle="MORE"
              link="./lists"
            />
            {movie.lists && movie.lists.length > 0 ? (
              <section className={styles.sectionReviews}>
                {movie.lists.map((list) => (
                  <article key={list.id} className={styles.articleList}>
                    <p className={styles.pListName}>{list.name}</p>
                    <p className={styles.pListAuthor}>- {list.user.username}</p>
                  </article>
                ))}
              </section>
            ) : (
              <p>No lists available.</p>
            )}
          </section>
        </section>
      </section>
    </>
  );
}

export default MoviePage;
