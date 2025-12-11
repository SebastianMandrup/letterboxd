import type { FunctionComponent } from 'react';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import useReviews from '../../hooks/useReviews';
import ReviewCard from '../shared/reviewCard/ReviewCard';

const PopularReviews: FunctionComponent = () => {
    const { data, error, isLoading } = useReviews({
        params: {
            filterBy: 'popularThisWeek',
            pageSize: 6,
        },
    });

    return (
        <section>
            <SectionHeader title="popular reviews this week" />
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
