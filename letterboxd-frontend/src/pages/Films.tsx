import SectionBrowseBy from '../components/films/SectionBrowseBy'
import Footer from '../components/shared/footer/Footer'
import Header from '../components/shared/header/Header'
import styles from './films.module.css'

function FilmsPage() {

    return (
        <>
            <Header />
            <main className={styles.mainFilms}>
                <SectionBrowseBy />
            </main>
            <Footer />
        </>
    )
}

export default FilmsPage
