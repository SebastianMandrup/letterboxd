import { useSearchParams } from 'react-router-dom'
import BrowseMoviesResults from '../components/browseMovies/BrowseMoviesResults'
import FormBrowseBy from '../components/films/FormBrowseBy'
import FormSearchFilm from '../components/films/FormSearchFilm'
import Footer from '../components/shared/footer/Footer'
import Header from '../components/shared/header/Header'
import styles from './moviesPage.module.css'

function MoviesBrowsePage() {

    const [searchParams] = useSearchParams();

    const selectedDecade = searchParams.get('decade') || '';
    const selectedRating = searchParams.get('rating') || '';
    const selectedPopular = searchParams.get('popular') || '';
    const selectedGenre = searchParams.get('genre') || '';

    return (
        <>
            <Header />
            <main className={styles.mainMovies}>
                <section className={styles.sectionBrowse}>
                    <FormBrowseBy selectedDecade={selectedDecade} selectedRating={selectedRating} selectedPopular={selectedPopular} selectedGenre={selectedGenre} />
                    <FormSearchFilm />
                </section>
                <BrowseMoviesResults selectedDecade={selectedDecade} selectedRating={selectedRating} selectedPopular={selectedPopular} selectedGenre={selectedGenre} />
            </main>
            <Footer />
        </>
    )
}

export default MoviesBrowsePage