import type { FunctionComponent } from 'react';
import styles from './featuredUserCard.module.css';

const LoadingFeaturedUserCard: FunctionComponent = () => {
    return (
        <article className={styles.card}>
            <div className={styles.loadingAvatar + ' pulse'} />
            <div className={styles.loadingUsername + ' pulse'}></div>
            <div className={styles.loadingStats + ' pulse'}></div>
        </article>
    );
};

export default LoadingFeaturedUserCard;
