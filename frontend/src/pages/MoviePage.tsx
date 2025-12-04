import { useParams } from 'react-router-dom';
import Backdrop from '../components/index/backdrop/Backdrop';
import ArticleMovie from '../components/shared/movieCard/MovieCard';
import SectionHeader from '../components/shared/sectionHeader/SectionHeader';
import { getMediumPoster } from '../services/getMediumPoster';
import styles from './moviePage.module.css';
import ListCardWithDescription from '../components/shared/listCard/ListCardWithDescription';
import useMovieByTitle from '../hooks/useMovieByTitle';
import ReviewCardContent from '../components/shared/reviewCard/ReviewCardContent';
import { useUserStore } from '../stores/useUserStore';

function MoviePage() {
    const title = useParams().title || '';

    const { isAuthenticated } = useUserStore();

    const { data: movie, error, isLoading } = useMovieByTitle(title);

    if (!title) return <p>No movie title provided.</p>;

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading movie.</p>;
    }

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
                    <ArticleMovie title={movie.title} src={getMediumPoster(movie.posterUrl)} alt={'poster of ' + movie.title} />
                </section>
                <section className={styles.sectionMain}>
                    <section className={styles.sectionFirstContent}>
                        <section className={styles.sectionLeft}>
                            <header className={styles.headerMovieDetails}>
                                <h1 className={styles.h1MovieTitle}>{movie.title}</h1>
                                <p className={styles.pReleaseYear}>{movie.releaseDate?.toString().split('-')[0] || ''}</p>
                            </header>
                            <p className={styles.pMovieOverview}>{movie.overview}</p>
                        </section>
                        <section className={styles.sectionRight}>
                            <div className={styles.divButtonsMoviePage}>
                                {!isAuthenticated() ? (
                                    <>
                                        <button className={styles.buttonLogRateReview}>Sign in to log, rate or review</button>
                                        <button className={styles.buttonShareMovie}>Share</button>
                                    </>
                                ) : (
                                    <>
                                        <button className={styles.buttonLogRateReview}>Log, Rate, Review</button>
                                        <button className={styles.buttonShareMovie}>Share</button>
                                    </>
                                )}
                            </div>
                        </section>
                    </section>
                    <section>
                        <SectionHeader title="Popular Reviews" subtitle="MORE" link="./reviews" />
                        {movie.reviews && movie.reviews.length > 0 ? (
                            <section className={styles.sectionReviews}>
                                {movie.reviews.map((review) => (
                                    <ReviewCardContent key={review.id} review={review} />
                                ))}
                            </section>
                        ) : (
                            <p>No reviews available.</p>
                        )}
                    </section>
                    <section>
                        <SectionHeader title="Popular Lists" subtitle="MORE" link="./lists" />
                        {movie.lists && movie.lists.length > 0 ? (
                            <section className={styles.sectionReviews}>
                                {movie.lists.map((list) => (
                                    <ListCardWithDescription key={list.id} list={list} />
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
