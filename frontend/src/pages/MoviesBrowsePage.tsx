import { useSearchParams } from 'react-router-dom';
import BrowseMoviesResults from '../components/browseMovies/BrowseMoviesResults';
import FormBrowseBy from '../components/films/FormBrowseBy';
import FormSearchFilm from '../components/films/FormSearchFilm';
import styles from './moviesBrowsePage.module.css';

function MoviesBrowsePage() {
  const [searchParams] = useSearchParams();

  const selectedDecade = searchParams.get('decade') || '';
  const selectedRating = searchParams.get('rating') || '';
  const selectedPopular = searchParams.get('popular') || '';
  const selectedGenre = searchParams.get('genre') || '';
  const selectedTitle = searchParams.get('title') || '';

  return (
    <>
      <section className={styles.sectionBrowse}>
        <FormBrowseBy
          selectedDecade={selectedDecade}
          selectedRating={selectedRating}
          selectedPopular={selectedPopular}
          selectedGenre={selectedGenre}
        />
        <FormSearchFilm />
      </section>
      <BrowseMoviesResults
        selectedDecade={selectedDecade}
        selectedRating={selectedRating}
        selectedPopular={selectedPopular}
        selectedGenre={selectedGenre}
        selectedTitle={selectedTitle}
      />
    </>
  );
}

export default MoviesBrowsePage;
