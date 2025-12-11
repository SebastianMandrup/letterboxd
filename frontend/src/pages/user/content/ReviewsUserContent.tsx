import type { FunctionComponent } from 'react';
import type ReviewDto from '../../../DTO/ReviewDto';
import SectionHeader from '../../shared/sectionHeader/SectionHeader';
import styles from './reviewsUserContent.module.css';
import ReviewCard from '../../shared/reviewCard/ReviewCard';

interface ReviewsUserContentProps {
    reviews: ReviewDto[];
}

const ReviewsUserContent: FunctionComponent<ReviewsUserContentProps> = ({ reviews }) => {
    return (
        <section>
            <SectionHeader title="Reviews" />
            {reviews.length === 0 ? (
                <div className="centeredContainer">
                    <p className={styles.noReviews}>This user has not written any reviews yet.</p>
                </div>
            ) : (
                reviews.map((review) => <ReviewCard key={review.id} review={review} />)
            )}
        </section>
    );
};

export default ReviewsUserContent;
