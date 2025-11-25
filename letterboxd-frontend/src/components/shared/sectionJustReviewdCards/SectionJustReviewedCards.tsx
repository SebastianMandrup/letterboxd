import useMovies from '../../../hooks/useMovies';
import { getThumbnailPoster } from '../../../services/getThumbnailPoster';
import MovieCard from '../movieCard/MovieCard';
import SectionHeader from '../sectionHeader/SectionHeader';
import styles from './sectionJustReviewedCards.module.css';

function SectionJustReviewedCards() {

    const { data, error, isLoading } = useMovies({
        params: {
            justReviewed: true,
            pageSize: 11,
        }
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading movies.</div>;
    }

    return (
        <>
            <SectionHeader title="Just Reviewed..." subtitle='2,944,858,769 films watched' />
            <ul className={styles.listJustReviewedCards}>
                {data?.results.map((movie, index) => (
                    <li key={index} className={styles.listItemReviewedMovie}>
                        <MovieCard
                            title={movie.title}
                            src={getThumbnailPoster(movie.posterUrl)}
                            alt={`Poster of ${movie.title}`}
                            overlay={
                                <header>
                                    {movie.title}
                                </header>
                            }
                        />
                    </li>
                ))}
            </ul>
        </>
    );
}

export default SectionJustReviewedCards;