import type { FunctionComponent } from 'react';
import styles from './reviewCardContent.module.css';
import type ReviewDto from '../../../DTO/ReviewDto';
import { getSlug } from '../../../services/getSlug';
import { getApiAvatar } from '../../../services/getApiAvatar';

interface ReviewCardContentProps {
  review: ReviewDto;
}

const ReviewCardContent: FunctionComponent<ReviewCardContentProps> = ({
  review,
}) => {
  return (
    <div>
      <section className={styles.titleAndYear}>
        <a
          className={styles.movieTitle}
          href={`/movie/${getSlug(review.movie.title)}`}
        >
          {review.movie.title}
        </a>
        <p className={styles.movieYear}>
          {new Date(review.movie.releaseDate).getFullYear()}
        </p>
      </section>
      <section>
        <div className={styles.authorAndAvatar}>
          <img
            className={styles.avatar}
            alt={`${review.author.username}'s avatar`}
            src={getApiAvatar(review.author.username)}
          ></img>
          <a
            className={styles.authorUsername}
            href={`/user/${getSlug(review.author.username)}`}
          >
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
          <button className={styles.buttonLikeReview}>
            <div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Liked"
              >
                <path
                  d="M12 21.4s-6.7-4.6-9.3-7.3C.9 11.9 1 7.9 4.3 5.9 6.1 4.7 8.4 5 10 6.3c.9.8 1.6 1.6 2 2 .4-.4 1.1-1.2 2-2 1.6-1.3 3.9-1.6 5.7-.4 3.3 2 3.4 6 1.6 8.2-2.6 2.7-9.3 7.3-9.3 7.3z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <p>Like Review</p>
          </button>
          <p className={styles.likeCount}>{review.likeCount} likes</p>
        </div>
      </section>
    </div>
  );
};

export default ReviewCardContent;
