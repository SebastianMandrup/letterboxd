import { useParams } from 'react-router-dom';
import Backdrop from '../shared/backdrop/Backdrop';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import styles from './moviePage.module.css';
import ListCardWithDescription from '../shared/listCard/ListCardWithDescription';
import useMovieByTitle from '../../hooks/movies/useMovieByTitle';
import ReviewCardContent from '../shared/reviewCard/ReviewCardContent';
import { useState } from 'react';
import type ReviewDto from '../../DTO/ReviewDto';
import { getSlug } from '../../util/getSlug';
import MovieAside from './MovieAside';
import MovieButtonGroup from './MovieButtonGroup';
import LoadingMoviePage from './LoadingMoviePage';

function MoviePage() {
    const title = useParams().title || '';
    const { data: movie, error, isLoading } = useMovieByTitle(title);

    const [reviews, setReviews] = useState<ReviewDto[]>([]);

    if (isLoading || error || !movie) {
        return <LoadingMoviePage error={error} />;
    }
    return (
        <>
            <Backdrop backdropPath={movie.backdropPath} title={movie.title} />

            <section className={styles.sectionMovieDetails}>
                <MovieAside movie={movie} />
                <section className={styles.sectionMain}>
                    <section className={styles.sectionFirstContent}>
                        <section className={styles.sectionLeft}>
                            <header className={styles.headerMovieDetails}>
                                <h1 className={styles.h1MovieTitle}>{movie.title}</h1>
                                <p className={styles.pReleaseYear}>{movie.releaseDate?.toString().split('-')[0] || ''}</p>
                            </header>
                            <p className={styles.pMovieTagline}>{movie.tagline ? "'" + movie.tagline + "'" : ''}</p>
                            <section className={styles.sectionMovieGenres}>
                                {movie.genres.map((genre) => (
                                    <a key={genre.id} className={styles.linkGenre} href={`/movies/browse?genre=${getSlug(genre.name)}`}>
                                        {genre.name}
                                    </a>
                                ))}
                            </section>
                            <p className={styles.pMovieOverview}>{movie.overview}</p>
                        </section>
                        <section className={styles.sectionRight}>
                            <MovieButtonGroup movie={movie} reviews={reviews} setReviews={setReviews} />
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
        </>
    );
}

export default MoviePage;
