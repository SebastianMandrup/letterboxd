import { useState, type FunctionComponent } from 'react';
import useMovies from '../../hooks/useMovies';
import MovieCard from '../shared/movieCard/MovieCard';
import styles from './browseMoviesResults.module.css';
import { getMediumPoster } from '../../services/getMediumPoster';

interface BrowseMoviesResultsProps {
    selectedDecade?: string;
    selectedRating?: string;
    selectedPopular?: string;
    selectedGenre?: string;
    selectedTitle?: string;
}

const BrowseMoviesResults: FunctionComponent<BrowseMoviesResultsProps> = ({ selectedDecade, selectedRating, selectedPopular, selectedGenre, selectedTitle }) => {

    const [page, setPage] = useState(1);

    const { data, error, isLoading } = useMovies({
        params: {
            decade: selectedDecade,
            rating: selectedRating,
            popular: selectedPopular,
            genre: selectedGenre,
            page: page,
            title: selectedTitle,
        }
    });


    return (
        <section className={styles.sectionBrowseResults}>

            {isLoading && <p>Loading movies...</p>}

            {data &&
                <>
                    {isLoading && <div></div>}
                    {error && <p>Error loading movies.</p>}

                    <ul>
                        {data.results.map((movie) => (
                            <li key={movie.id}>
                                <MovieCard
                                    title={movie.title}
                                    src={getMediumPoster(movie.posterUrl)}
                                    alt={`Poster of ${movie.title}`}
                                    overlay={
                                        <header>
                                            {movie.title}
                                        </header>
                                    }
                                />
                            </li>
                        ))
                        }
                    </ul>
                    <nav className={styles.pagination}>
                        {data?.previous && <button onClick={() => setPage(page - 1)}>Previous</button>}
                        {!data?.previous && <div></div>}
                        {data?.next && <button onClick={() => setPage(page + 1)}>Next</button>}
                    </nav>
                </>
            }
        </section>
    );
}

export default BrowseMoviesResults;