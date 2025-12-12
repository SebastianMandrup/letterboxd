import { useAuth } from '../../../hooks/useAuth';
import PopularReviews from '../../movies/PopularReviews';
import SectionJustReviewedCards from '../../shared/sectionJustReviewedCards/SectionJustReviewedCards';
import styles from './sectionJustReviewed.module.css';
import SectionPopularLists from './SectionPopularLists';

function SectionJustReviewed() {
    const { user } = useAuth();

    return (
        <section>
            <SectionJustReviewedCards />
            <p className={styles.pWriteShare}>Write and share reviews. Compile your own lists. Share your life in film.</p>
            <p className={styles.pBelow}>
                Below are some popular reviews and lists from this week.
                {!user && (
                    <>
                        <button className={styles.btnSignup}> Sign up </button>
                        <span>to create your own.</span>
                    </>
                )}
            </p>

            <section className={styles.sectionPopularReviewsAndLists}>
                <PopularReviews />
                <SectionPopularLists />
            </section>
        </section>
    );
}

export default SectionJustReviewed;
