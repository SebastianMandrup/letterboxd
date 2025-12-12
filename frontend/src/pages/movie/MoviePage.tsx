import { useParams } from 'react-router-dom';
import Backdrop from '../shared/backdrop/Backdrop';
import ArticleMovie from '../shared/movieCard/MovieCard';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import { getMediumPoster } from '../../util/getMediumPoster';
import styles from './moviePage.module.css';
import ListCardWithDescription from '../shared/listCard/ListCardWithDescription';
import useMovieByTitle from '../../hooks/movies/useMovieByTitle';
import ReviewCardContent from '../shared/reviewCard/ReviewCardContent';
import { useUserStore } from '../../stores/useUserStore';
import { useEffect, useState } from 'react';
import ReviewModal from './ReviewModal';
import type ReviewDto from '../../DTO/ReviewDto';
import Eye from '../shared/icons/EyeIcon';
import { useToastStore } from '../../stores/useToastStore';
import useViewMovie from '../../hooks/movies/useViewMovie';

function MoviePage() {
    const title = useParams().title || '';
    const { isAuthenticated } = useUserStore();
    const { addToast } = useToastStore();
    const { data: movie, error, isLoading } = useMovieByTitle(title);
    const viewMovieMutation = useViewMovie();

    const [isReviewing, setIsReviewing] = useState(false);
    const [reviews, setReviews] = useState<ReviewDto[]>([]);
    const [isViewed, setIsViewed] = useState(false);

    useEffect(() => {
        if (!movie || !movie.reviews || !movie.isViewed) return;
        setReviews(movie.reviews);
        setIsViewed(movie.isViewed);
    }, [movie]);

    const handleView = async () => {
        if (!movie) return;

        viewMovieMutation.mutate(movie.id, {
            onSuccess: () => {
                setIsViewed((prev) => !prev);
                addToast(isViewed ? 'Marked as unviewed' : 'Marked as viewed', 'success');
            },
            onError: (error) => {
                console.error('Error marking movie as viewed:', error);
                addToast(error.message, 'error');
            },
        });
    };

    // TODO: loading and error combined component
    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading movie.</p>;
    }

    if (!movie) return null;
    return (
        <>
            <Backdrop backdropPath={movie.backdropPath} title={movie.title} />

            <section className={styles.sectionMovieDetails}>
                <section className={styles.sectionPoster}>
                    <ArticleMovie title={movie.title} src={getMediumPoster(movie.posterPath)} alt={'poster of ' + movie.title} />
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
                                        <button className={styles.buttonView} onClick={() => handleView()}>
                                            <Eye size={24} color={isViewed ? 'var(--green)' : 'var(--grey)'} />
                                            {isViewed ? 'Unmark as Viewed' : 'Mark as Viewed'}
                                        </button>
                                        <button className={styles.buttonReview} onClick={() => setIsReviewing(true)}>
                                            Review
                                        </button>
                                        <button className={styles.buttonShareMovie}>Share</button>
                                    </>
                                )}
                            </div>
                        </section>
                    </section>
                    <section>
                        <SectionHeader title="Popular Reviews" subtitle="MORE" link="./reviews" />
                        {reviews && reviews.length > 0 ? (
                            <section className={styles.sectionReviews}>
                                {reviews.map((review) => (
                                    <ReviewCardContent key={review.id} review={review} withMovieTitle={false} />
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

            {isReviewing && <ReviewModal setIsReviewing={setIsReviewing} movie={movie} reviews={reviews} setReviews={setReviews} />}
        </>
    );
}

export default MoviePage;
