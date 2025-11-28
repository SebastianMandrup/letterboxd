import FormBrowseBy from '../components/films/FormBrowseBy'
import FormSearchFilm from '../components/films/FormSearchFilm'
import PopularMovies from '../components/films/PopularMovies'
import AdBanner from '../components/shared/adBanner/adBanner'
import SectionJustReviewedCards from '../components/shared/sectionJustReviewdCards/SectionJustReviewedCards'
import styles from './moviesPage.module.css'

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
        </>
    )
}

export default MoviesPage
