import type React from 'react';
import type { FunctionComponent } from 'react';
import styles from './articleMovie.module.css';

interface ArticleMovieProps {
    src: string;
    alt: string;
    overlay?: React.ReactNode;
}

const ArticleMovie: FunctionComponent<ArticleMovieProps> = ({ src, alt, overlay }) => {

    console.log('Rendering ArticleMovie with src:', src, 'and alt:', alt);

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