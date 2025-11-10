import { useState, type FunctionComponent } from 'react';
import useMovies from '../../hooks/useMovies';
import ArticleMovie from '../shared/ArticleMovie';
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


    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading movies.</p>;
    }

    return (
        <section className={styles.sectionBrowseResults}>
            <ul>
                {data && data.results.map((movie) => (
                    <li key={movie.id}>
                        <ArticleMovie src={movie.posterUrl || ''} alt={"poster of " + movie.title} />
                    </li>
                ))
                }
            </ul>
            <nav className={styles.pagination}>
                {data?.previous && <button onClick={() => setPage(page - 1)}>Previous</button>}
                {!data?.previous && <div></div>}
                {data?.next && <button onClick={() => setPage(page + 1)}>Next</button>}
            </nav>
        </section>
    );
}

export default BrowseMoviesResults;