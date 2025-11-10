import type React from 'react';
import type { FunctionComponent } from 'react';
import styles from './articleMovie.module.css';

interface ArticleMovieProps {
    src: string;
    alt: string;
    overlay?: React.ReactNode;
}

const ArticleMovie: FunctionComponent<ArticleMovieProps> = ({ src, alt, overlay }) => {

    if (src === '') {
        src = '/placeholder-movie.png';
    }

    return (
        <article className={styles.articleMovie}>
            <img src={src} alt={alt} />
            {overlay && (
                overlay
            )}
        </article>
    );
}

export default ArticleMovie;