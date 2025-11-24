import { useState, type FunctionComponent } from 'react';
import useMovies from '../../hooks/useMovies';
import { getThumbnailPoster } from '../../services/getThumbnailPoster';
import ArticleMovie from '../shared/movieCard/MovieCard';
import styles from './browseMoviesResults.module.css';

interface BrowseMoviesResultsProps {
    selectedDecade?: string;
    selectedRating?: string;
    selectedPopular?: string;
    selectedGenre?: string;
}

const BrowseMoviesResults: FunctionComponent<BrowseMoviesResultsProps> = ({ selectedDecade, selectedRating, selectedPopular, selectedGenre }) => {

    const [page, setPage] = useState(1);

    const { data, error, isLoading } = useMovies({
        params: {
            decade: selectedDecade,
            rating: selectedRating,
            popular: selectedPopular,
            genre: selectedGenre,
            page: page,
        }
    })


    return (
        <section className={styles.sectionBrowseResults}>

            <section className={styles.statusMessages}>
                {isLoading && <div></div>}
                {error && <p>Error loading movies.</p>}
            </section>

            {data &&
                <ul>
                    {data.results.map((movie) => (
                        <li key={movie.id}>
                            <ArticleMovie title={movie.title} src={getThumbnailPoster(movie.posterUrl)} alt={"poster of " + movie.title} />
                        </li>
                    ))
                    }
                </ul>
            }
            <nav className={styles.pagination}>
                {data?.previous && <button onClick={() => setPage(page - 1)}>Previous</button>}
                {!data?.previous && <div></div>}
                {data?.next && <button onClick={() => setPage(page + 1)}>Next</button>}
            </nav>
        </section>
    );
}

export default BrowseMoviesResults;