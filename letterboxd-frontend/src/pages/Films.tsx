import FormBrowseBy from '../components/films/FormBrowseBy'
import FormSearchFilm from '../components/films/FormSearchFilm'
import PopularFilms from '../components/films/PopularFilms'
import Footer from '../components/shared/footer/Footer'
import Header from '../components/shared/header/Header'
import styles from './films.module.css'

function FilmsPage() {

    return (
        <>
            <Header />
            <main className={styles.mainFilms}>
                <section className={styles.sectionBrowse}>
                    <FormBrowseBy />
                    <FormSearchFilm />
                </section>
                <PopularFilms />
            </main>
            <Footer />
        </>
    )
}

export default FilmsPage
