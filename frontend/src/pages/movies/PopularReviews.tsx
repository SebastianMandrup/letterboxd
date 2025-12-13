import type { FunctionComponent } from 'react';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import ReviewCard from '../shared/reviewCard/ReviewCard';
import usePopularReviewsThisWeek from '../../hooks/reviews/usePopularReviewsThisWeek';
import LoadingMovieCard from '../shared/movieCard/LoadingMovieCard';

const PopularReviews: FunctionComponent = () => {
    const { data, error, isLoading } = usePopularReviewsThisWeek();

    return (
        <section>
            <SectionHeader title="popular reviews this week" />

            {isLoading || error || !data ? Array.from({ length: 3 }).map((_, index) => <LoadingMovieCard key={index} />) : null}
            {data && data.results.map((review) => <ReviewCard key={review.id} review={review} />)}
        </section>
    );
};

export default PopularReviews;
