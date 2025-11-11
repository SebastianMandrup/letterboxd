import FormBrowseBy from '../components/films/FormBrowseBy'
import FormSearchFilm from '../components/films/FormSearchFilm'
import PopularMovies from '../components/films/PopularMovies'
import Footer from '../components/shared/footer/Footer'
import Header from '../components/shared/header/Header'
import SectionJustReviewedCards from '../components/shared/SectionJustReviewedCards'
import styles from './moviesPage.module.css'

function MoviesPage() {

    return (
        <>
            <Header />
            <main className={styles.mainMovies}>
                <section className={styles.sectionBrowse}>
                    <FormBrowseBy />
                    <FormSearchFilm />
                </section>
                <PopularMovies />
                <SectionJustReviewedCards />
            </main>
            <Footer />
        </>
    )
}

export default MoviesPage
