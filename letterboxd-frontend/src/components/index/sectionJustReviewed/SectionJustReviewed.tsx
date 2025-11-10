import useMovies from '../../../hooks/useMovies';
import ArticleMovie from '../../shared/ArticleMovie';
import SectionHeader from '../../shared/SectionHeader';
import styles from './sectionJustReviewed.module.css';
import SectionPopularLists from './SectionPopularLists';
import SectionPopularReviews from './SectionPopularReviews';

function SectionJustReviewed() {

    const { data, error, isLoading } = useMovies({
        params: { justReviewed: true }
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading movies.</div>;
    }

    return (
        <section>
            <SectionHeader title="Just Reviewed..." subtitle='2,944,858,769 films watched' />
            <ul id={styles.listJustReviewed}>
                {data?.results.map((movie, index) => (
                    <li key={index} className={styles.listItemReviewedMovie}>
                        <ArticleMovie
                            src={movie.posterUrl ?? ""}
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
            <p id={styles.pWriteShare}>
                Write and share reviews. Compile your own lists. Share your life in film.
            </p>
            <p id={styles.pBelow}>
                Below are some popular reviews and lists from this week.
                <a href=""> Sign up </a>
                to create your own.
            </p>

            <section id={styles.sectionPopularReviewsAndLists}>
                <SectionPopularReviews />
                <SectionPopularLists />
            </section>
        </section>

    );
}

export default SectionJustReviewed;