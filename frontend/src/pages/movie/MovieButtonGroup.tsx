import { useEffect, useState, type FunctionComponent } from 'react';
import { useUserStore } from '../../stores/useUserStore';
import styles from './movieButtonGroup.module.css';
import type MovieDto from '../../DTO/MovieDto';
import ReviewModal from './ReviewModal';
import useViewMovie from '../../hooks/movies/useViewMovie';
import { useToastStore } from '../../stores/useToastStore';
import EyeIcon from '../shared/icons/EyeIcon';
import type ReviewDto from '../../DTO/ReviewDto';
import ShareButton from '../shared/shareButton/ShareButton';

interface MovieButtonGroupProps {
    movie: MovieDto;
    reviews: ReviewDto[];
    setReviews: (reviews: ReviewDto[]) => void;
}

const MovieButtonGroup: FunctionComponent<MovieButtonGroupProps> = ({ movie, reviews, setReviews }) => {
    const { isAuthenticated } = useUserStore();
    const viewMovieMutation = useViewMovie();

    const [isViewed, setIsViewed] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const { addToast } = useToastStore();

    useEffect(() => {
        if (!movie || !movie.reviews || !movie.isViewed) return;
        setReviews(movie.reviews);
        setIsViewed(movie.isViewed);
    }, [movie, setReviews]);

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

    return (
        <div className={styles.divButtonsMoviePage}>
            {!isAuthenticated() ? (
                <button className={styles.buttonLogRateReview}>Sign in to log, rate or review</button>
            ) : (
                <>
                    <button className={styles.buttonView} onClick={() => handleView()}>
                        <EyeIcon size={24} color={isViewed ? 'var(--green)' : 'var(--grey)'} />
                        {isViewed ? 'Unmark as Viewed' : 'Mark as Viewed'}
                    </button>
                    <button className={styles.buttonReview} onClick={() => setIsReviewing(true)}>
                        Review
                    </button>
                </>
            )}
            <ShareButton />
            {isReviewing && <ReviewModal setIsReviewing={setIsReviewing} movie={movie} reviews={reviews} setReviews={setReviews} />}
        </div>
    );
};

export default MovieButtonGroup;
