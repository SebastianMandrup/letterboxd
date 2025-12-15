import { useState, type FunctionComponent } from 'react';
import styles from './reviewCardContent.module.css';
import type ReviewDto from '../../../DTO/ReviewDto';
import { getSlug } from '../../../util/getSlug';
import { getApiAvatar } from '../../../util/getApiAvatar';
import { useUserStore } from '../../../stores/useUserStore';
import { useToastStore } from '../../../stores/useToastStore';
import Heart from '../icons/HeartIcon';
import DeleteIcon from '../icons/DeleteIcon';
import useLikeReview from '../../../hooks/reviews/useLikeReview';
import useDeleteReview from '../../../hooks/reviews/useDeleteReview';
import { Link } from 'react-router-dom';

interface ReviewCardContentProps {
    review: ReviewDto;
    withMovieTitle?: boolean;
    handleDelete: () => void;
}

const ReviewCardContent: FunctionComponent<ReviewCardContentProps> = ({ review, withMovieTitle = true, handleDelete }) => {
    // TODO: move logic
    if (!review.likeCount) {
        review.likeCount = 0;
    }

    const { user } = useUserStore();
    const { addToast } = useToastStore();
    const [isLiked, setIsLiked] = useState(review.isLiked);
    const [likedCount, setLikedCount] = useState(review.likeCount);
    const likeReviewMutation = useLikeReview();
    const deleteReviewMutation = useDeleteReview();

    const handleLike = () => {
        if (!user) {
            addToast('You must be logged in to like reviews.', 'warning');
            return;
        }

        likeReviewMutation.mutate(review.id, {
            onSuccess: (response) => {
                if (response.message === 'Review liked successfully') {
                    setIsLiked(true);
                    setLikedCount((count) => count + 1);
                } else {
                    setIsLiked(false);
                    setLikedCount((count) => count - 1);
                }
            },
            onError: (error) => {
                addToast(error.message, 'error');
            },
        });
    };

    const handleDeleteClick = () => {
        deleteReviewMutation.mutate(review.id, {
            onSuccess: (response) => {
                addToast(response.message, 'success');
                handleDelete();
            },
            onError: (error) => {
                addToast(error.message, 'error');
            },
        });
    };

    return (
        <article className={styles.reviewCardContent}>
            {withMovieTitle && (
                <section className={styles.titleAndYear}>
                    <Link className={styles.movieTitle} to={`/movie/${getSlug(review.movie.title)}`}>
                        {review.movie.title}
                    </Link>
                    <p className={styles.movieYear}>{new Date(review.movie.releaseDate).getFullYear()}</p>
                </section>
            )}
            <section>
                <div className={styles.authorAndAvatar}>
                    <img className={styles.avatar} alt={`${review.author.username}'s avatar`} src={getApiAvatar(review.author.username)}></img>
                    <Link className={styles.authorUsername} to={`/user/${getSlug(review.author.username)}`}>
                        {review.author.username}
                    </Link>
                    <div className={styles.divStars}>
                        {[...Array(Math.round(review.rating))].map((_, starIndex) => (
                            <span key={starIndex}>★</span>
                        ))}
                    </div>
                </div>
                <p className={styles.reviewText}>{review.review}</p>
                <div className={styles.likeContainer}>
                    <button className={styles.buttonLikeReview} onClick={() => handleLike()}>
                        <Heart size={28} color={isLiked ? 'var(--orange)' : 'var(--grey)'} />
                    </button>
                    <p className={styles.likeCount}>{likedCount} likes</p>
                </div>
                {user && user.username === review.author.username && (
                    <button className={styles.deleteButton} onClick={() => handleDeleteClick()}>
                        <DeleteIcon size={24} />
                    </button>
                )}
            </section>
        </article>
    );
};

export default ReviewCardContent;
