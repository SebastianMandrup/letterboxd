import type { FunctionComponent } from 'react';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import ReviewCard from '../shared/reviewCard/ReviewCard';
import usePopularReviewsThisWeek from '../../hooks/reviews/usePopularReviewsThisWeek';

const PopularReviews: FunctionComponent = () => {
    const { data, error, isLoading } = usePopularReviewsThisWeek();

    return (
        <section>
            <SectionHeader title="popular reviews this week" />

            {/* TODO: refactor into single reusable component */}
            {isLoading && (
                <div className="centeredContainer">
                    <div className="spinner"></div>
                </div>
            )}

            {error || !data ? <p>Failed to load popular reviews.</p> : null}

            {data && data.results.map((review) => <ReviewCard key={review.id} review={review} />)}
        </section>
    );
};

export default PopularReviews;
