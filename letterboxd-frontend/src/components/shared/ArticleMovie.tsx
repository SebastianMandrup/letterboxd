import type React from 'react';
import type { FunctionComponent } from 'react';
import styles from './articleMovie.module.css';

interface ArticleMovieProps {
    title: string;
    src: string;
    alt: string;
    overlay?: React.ReactNode;
}

const ArticleMovie: FunctionComponent<ArticleMovieProps> = ({ title, src, alt, overlay }) => {

    if (src === '') {
        src = '/placeholder-movie.png';
    }

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

export default ArticleMovie;