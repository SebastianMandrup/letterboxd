import type { FunctionComponent } from 'react';
import styles from './listCard.module.css';

interface LoadingListCardProps {
    count?: number;
    large?: boolean;
}

const LoadingListCard: FunctionComponent<LoadingListCardProps> = ({ count = 1, large = false }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <article className={styles.loadingListCard} key={index}>
                    <div className={styles.loadingPosterStack} />
                    <section className={styles.listInfo}>
                        <div className={styles.loadingListName} />
                        <div className={styles.listAuthor + (large ? ` ${styles.large}` : '')}>
                            <div className={styles.avatar} />
                            <div className={styles.loadingUsername}></div>
                        </div>
                    </section>
                </article>
            ))}
        </>
    );
};

export default LoadingListCard;
