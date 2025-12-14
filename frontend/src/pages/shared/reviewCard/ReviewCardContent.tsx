import { useState, type FunctionComponent } from 'react';
import styles from './reviewCardContent.module.css';
import type ReviewDto from '../../../DTO/ReviewDto';
import { getSlug } from '../../../util/getSlug';
import { getApiAvatar } from '../../../util/getApiAvatar';
import { useUserStore } from '../../../stores/useUserStore';
import { useToastStore } from '../../../stores/useToastStore';
import Heart from '../icons/HeartIcon';
import reviewService from '../../../clients/ReviewClient';

interface ReviewCardContentProps {
    review: ReviewDto;
    withMovieTitle?: boolean;
}

const ReviewCardContent: FunctionComponent<ReviewCardContentProps> = ({ review, withMovieTitle = true }) => {
    if (!review.likeCount) {
        review.likeCount = 0;
    }
    const { user } = useUserStore();
    const { addToast } = useToastStore();
    const [isLiked, setIsLiked] = useState(review.isLiked);
    const [likedCount, setLikedCount] = useState(review.likeCount);

    const handleLike = async () => {
        if (!user) {
            addToast('You must be logged in to like reviews.', 'warning');
            return;
        }

        try {
            const response = await reviewService.likeReview(review.id);

            if (!(response.status === 'ok')) {
                addToast(response.message, 'error');
                return;
            }

            if (response.message === 'Review unliked successfully') {
                setLikedCount(likedCount - 1);
                setIsLiked(false);
                addToast('Review unliked successfully.', 'success');
                return;
            } else if (response.message === 'Review liked successfully') {
                setLikedCount(likedCount + 1);
                setIsLiked(true);
                addToast('Review liked successfully.', 'success');
                return;
            }
        } catch (error) {
            console.error('Error liking review:', error);
            addToast('An error occurred while liking the review.', 'error');
            return;
        }
    };

    return (
        <div>
            {withMovieTitle && (
                <section className={styles.titleAndYear}>
                    <a className={styles.movieTitle} href={`/movie/${getSlug(review.movie.title)}`}>
                        {review.movie.title}
                    </a>
                    <p className={styles.movieYear}>{new Date(review.movie.releaseDate).getFullYear()}</p>
                </section>
            )}
            <section>
                <div className={styles.authorAndAvatar}>
                    <img className={styles.avatar} alt={`${review.author.username}'s avatar`} src={getApiAvatar(review.author.username)}></img>
                    <a className={styles.authorUsername} href={`/user/${getSlug(review.author.username)}`}>
                        {review.author.username}
                    </a>
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
            </section>
        </div>
    );
};

export default ReviewCardContent;
