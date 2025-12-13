import { Link } from 'react-router-dom';
import type ListDto from '../../../DTO/ListDto';
import type { FunctionComponent } from 'react';
import { getSlug } from '../../../util/getSlug';
import styles from './posterStack.module.css';
import { getThumbnailPoster } from '../../../util/getThumbnailPoster';

interface ListPosterStackProps {
    list: ListDto;
    large?: boolean;
}

const ListPosterStack: FunctionComponent<ListPosterStackProps> = ({ list, large }) => {
    const firstFiveMovies = list.movies.slice(0, 5);

    return (
        <Link to={`/lists/${getSlug(list.name)}`}>
            <section className={styles.posterStack + (large ? ` ${styles.large}` : '')}>
                {firstFiveMovies.map((movie, index) => (
                    <img
                        key={movie.id}
                        src={getThumbnailPoster(movie.posterPath)}
                        alt={movie.title}
                        className={styles.posterImage + (large ? ` ${styles.large}` : '')}
                        style={{
                            left: `${index * 38}px`, // overlap offset
                            zIndex: list.movies.length - index,
                        }}
                    />
                ))}
            </section>
        </Link>
    );
};

export default ListPosterStack;
