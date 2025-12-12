import type { FunctionComponent } from 'react';
import styles from './defaultUserContent.module.css';
import SectionHeader from '../../shared/sectionHeader/SectionHeader';
import type ListDto from '../../../DTO/ListDto';
import type ReviewDto from '../../../DTO/ReviewDto';
import ListCard from '../../shared/listCard/ListCard';
import ReviewCard from '../../shared/reviewCard/ReviewCard';

interface DefaultUserContentProps {
    recentLists: ListDto[];
    recentReviews: ReviewDto[];
}

const DefaultUserContent: FunctionComponent<DefaultUserContentProps> = ({ recentLists, recentReviews }) => {
    return (
        <section className={styles.defaultUserContent}>
            <section className={styles.recentLists}>
                <SectionHeader title="Recent Lists" />
                <div className={styles.listsContainer}>
                    {recentLists.length === 0 ? (
                        <p className={styles.noReviewsMessage}>This user has not created any lists yet.</p>
                    ) : (
                        recentLists.slice(0, 3).map((list) => <ListCard key={list.id} list={list} />)
                    )}
                </div>
            </section>

            <section className={styles.recentReviews}>
                <SectionHeader title="Recent Reviews" />
                <div>
                    {recentReviews.length === 0 ? (
                        <p className={styles.noReviewsMessage}>This user has not written any reviews yet.</p>
                    ) : (
                        recentReviews.slice(0, 5).map((review) => <ReviewCard key={review.id} review={review} />)
                    )}
                </div>
            </section>
        </section>
    );
};

export default DefaultUserContent;
