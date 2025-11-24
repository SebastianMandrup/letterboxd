import type React from 'react';
import type { FunctionComponent } from 'react';
import styles from './movieCard.module.css';

interface MovieCardProps {
    title: string;
    src: string;
    alt: string;
    overlay?: React.ReactNode;
}

const MovieCard: FunctionComponent<MovieCardProps> = ({ title, src, alt, overlay }) => {

    const handleClick = () => {
        location.href = `/movie/${title.split(' ').join('-').toLowerCase()}`;
    }

    return (
        <article className={styles.articleMovie} onClick={handleClick}>
            <img src={src} alt={alt} />
            {overlay && (
                overlay
            )}
        </article>
    );
}

export default MovieCard;