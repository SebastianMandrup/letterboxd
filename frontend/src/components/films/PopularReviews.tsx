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

  if (isLoading) {
    return (
      <div className="spinnerContainer">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !data) {
    return <p>Failed to load popular reviews.</p>;
  }

  return (
    <section>
      <SectionHeader title="popular reviews this week" />
      {data.results.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </section>
  );
};

export default PopularReviews;
