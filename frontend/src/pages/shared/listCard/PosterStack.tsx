import { Link } from 'react-router-dom';
import type ListDto from '../../../DTO/ListDto';
import type { FunctionComponent } from 'react';
import { getSlug } from '../../../util/getSlug';
import styles from './posterStack.module.css';
import { useEffect, useState } from 'react';

interface ListPosterStackProps {
    list: ListDto;
    large?: boolean;
}

const ListPosterStack: FunctionComponent<ListPosterStackProps> = ({ list, large }) => {
    const firstFiveMovies = list.movies.slice(0, 5);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        let loadedCount = 0;

        const handleLoad = () => {
            loadedCount++;
            if (loadedCount === firstFiveMovies.length) {
                setImagesLoaded(true);
            }
        };

        firstFiveMovies.forEach((movie) => {
            const img = new Image();
            img.src = movie.posterUrl ?? '/placeholder-movie.png';
            img.onload = handleLoad;
            img.onerror = handleLoad; // consider error as "loaded" too
        });
    }, [firstFiveMovies]);

    return (
        <Link to={`/lists/${getSlug(list.name)}`}>
            <section className={styles.posterStack + (large ? ` ${styles.large}` : '')}>
                {imagesLoaded ? (
                    firstFiveMovies.map((movie, index) => (
                        <img
                            key={movie.id}
                            src={movie.posterUrl ?? '/placeholder-movie.png'}
                            alt={movie.title}
                            className={styles.posterImage + (large ? ` ${styles.large}` : '')}
                            style={{
                                left: `${index * 38}px`, // overlap offset
                                zIndex: list.movies.length - index,
                            }}
                        />
                    ))
                ) : (
                    <div className={styles.posterStackPlaceholder + (large ? ` ${styles.large}` : '')}>
                        <div className="spinner"></div>
                    </div>
                )}
            </section>
        </Link>
    );
};

export default ListPosterStack;
