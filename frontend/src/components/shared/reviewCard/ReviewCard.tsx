import type { FunctionComponent } from 'react';
import type ReviewDto from '../../../DTO/ReviewDto';
import styles from './reviewCard.module.css';
import MovieCard from '../movieCard/MovieCard';
import { getThumbnailPoster } from '../../../services/getThumbnailPoster';
import ReviewCardContent from './ReviewCardContent';

interface ReviewCardProps {
  review: ReviewDto;
}

const ReviewCard: FunctionComponent<ReviewCardProps> = ({ review }) => {
  if (review.review.length > 200) {
    review.review = review.review.slice(0, 200) + '...';
  }

  return (
    <article className={styles.reviewCard}>
      <MovieCard
        title={review.movie.title}
        src={getThumbnailPoster(review.movie.posterUrl)}
        alt={review.movie.title}
      />
      <ReviewCardContent review={review} />
    </article>
  );
};

export default ReviewCard;
