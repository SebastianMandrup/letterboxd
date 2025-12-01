import FormBrowseBy from '../components/films/FormBrowseBy';
import FormSearchFilm from '../components/films/FormSearchFilm';
import PopularMovies from '../components/films/PopularMovies';
import PopularReviews from '../components/films/PopularReviews';
import PopularReviewsAside from '../components/films/PopularReviewsAside';
import AdBanner from '../components/shared/adBanner/AdBanner';
import SectionJustReviewedCards from '../components/shared/sectionJustReviewdCards/SectionJustReviewedCards';
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
