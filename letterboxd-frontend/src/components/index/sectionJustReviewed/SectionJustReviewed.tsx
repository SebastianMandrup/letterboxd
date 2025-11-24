import { useAuth } from '../../../hooks/useAuth';
import SectionJustReviewedCards from '../../shared/sectionJustReviewdCards/SectionJustReviewedCards';
import styles from './sectionJustReviewed.module.css';
import SectionPopularLists from './SectionPopularLists';
import SectionPopularReviews from './SectionPopularReviews';

function SectionJustReviewed() {

    const { user } = useAuth();

    return (
        <section>
            <SectionJustReviewedCards />
            <p id={styles.pWriteShare}>
                Write and share reviews. Compile your own lists. Share your life in film.
            </p>
            <p id={styles.pBelow}>
                Below are some popular reviews and lists from this week.
                {!user && (
                    <>
                        <button id={styles.btnSignup}> Sign up </button>
                        <span>
                            to create your own.
                        </span>
                    </>
                )}
            </p>

            <section id={styles.sectionPopularReviewsAndLists}>
                <SectionPopularReviews />
                <SectionPopularLists />
            </section>
        </section>

    );
}

export default SectionJustReviewed;