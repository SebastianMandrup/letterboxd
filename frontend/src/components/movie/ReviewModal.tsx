import { useState, type FunctionComponent } from 'react';
import styles from './reviewModal.module.css';
import type MovieDto from '../../DTO/MovieDto';
import MovieCard from '../shared/movieCard/MovieCard';
import { getMediumPoster } from '../../services/getMediumPoster';
import Heart from '../shared/icons/HeartIcon';
import StarRating from './StarRating';
import reviewService from '../../services/ReviewClient';
import { useToastStore } from '../../stores/useToastStore';
import type ReviewDto from '../../DTO/ReviewDto';

interface ReviewModalProps {
    setIsReviewing: (value: boolean) => void;
    movie: MovieDto;
    reviews: ReviewDto[];
    setReviews: (reviews: ReviewDto[]) => void;
}

const ReviewModal: FunctionComponent<ReviewModalProps> = ({ setIsReviewing, movie, reviews, setReviews }) => {
    const [liked, setLiked] = useState(false);
    const [rating, setRating] = useState(0);
    const { addToast } = useToastStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const review = formData.get('review') as string;

        if (rating === 0 || rating > 5) {
            addToast('Please provide a rating before submitting your review.', 'error');
            return;
        }

        const reviewData = {
            review,
            rating,
            movieId: movie.id,
            isLiked: liked,
        };

        try {
            const newReview = await reviewService.create(reviewData);
            setReviews([newReview, ...reviews]);
            setIsReviewing(false);
        } catch (error) {
            console.error('Error creating review:', error);
            const message = (error as Error).message || 'Error creating review';
            addToast(message, 'error');
        }
    };

    return (
        <div className={styles.reviewModal}>
            <section className={styles.reviewModalContent}>
                <header className={styles.reviewModalHeader}>
                    <h1 className={styles.reviewModalTitle}>I watched...</h1>
                    <button className={styles.closeButton} onClick={() => setIsReviewing(false)}>
                        &times;
                    </button>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className={styles.reviewContent}>
                        <MovieCard title={movie.title} src={getMediumPoster(movie.posterUrl)} alt={movie.title} />
                        <div className={styles.reviewInputs}>
                            <div className={styles.movieInfo}>
                                <h2 className={styles.movieTitle}>{movie.title}</h2>
                                <p className={styles.releaseYear}>{movie.releaseDate?.toString().split('-')[0] || ''}</p>
                            </div>
                            <textarea
                                name="review"
                                id="review"
                                className={styles.reviewTextarea}
                                placeholder="Add a review..."
                                minLength={10}
                                maxLength={255}
                            ></textarea>
                            <div className={styles.ratingLikeContainer}>
                                <div>
                                    <p className={styles.label}>Rating</p>
                                    <StarRating value={rating} onChange={(value) => setRating(value)} size={32} />
                                </div>
                                <div>
                                    <p className={styles.label}>Like</p>
                                    <button type="button" className={styles.likeButton} onClick={() => setLiked(!liked)}>
                                        <Heart size={32} color={liked ? 'var(--orange)' : 'var(--lightestGrey)'} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className={styles.reviewModalFooter}>
                        <button type="submit" className={styles.submitReviewButton} onClick={() => {}}>
                            SAVE
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
};

export default ReviewModal;
