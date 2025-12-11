import type { FunctionComponent } from 'react';
import styles from './movieCard.module.css';

const MovieCard: FunctionComponent = () => {
    return <div className={`${styles.loadingArticleMovie} ${styles.articleMovie} pulsing`}></div>;
};

export default MovieCard;
