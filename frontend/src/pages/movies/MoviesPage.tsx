import FormBrowseBy from './FormBrowseBy';
import FormSearchFilm from './FormSearchFilm';
import PopularMovies from './PopularMovies';
import PopularReviews from './PopularReviews';
import PopularReviewsAside from './PopularReviewsAside';
import AdBanner from '../shared/adBanner/AdBanner';
import SectionJustReviewedCards from '../shared/sectionJustReviewdCards/SectionJustReviewedCards';
import styles from './moviesPage.module.css';

function MoviesPage() {
    return (
        <>
            <section className={styles.sectionBrowse}>
                <FormBrowseBy />
                <FormSearchFilm />
            </section>
            <PopularMovies />
            <AdBanner />
            <SectionJustReviewedCards />
            <div className={styles.divPopularReviewsAndAside}>
                <PopularReviews />
                <PopularReviewsAside />
            </div>
        </>
    );
}

export default MoviesPage;
