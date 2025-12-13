import type { FunctionComponent } from 'react';

import styles from './listCard.module.css';
interface LoadingListCardWithDataProps {
    count?: number;
}

const LoadingListCardWithData: FunctionComponent<LoadingListCardWithDataProps> = ({ count = 1 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <article className={styles.listCard} key={index}>
                    <div className={`${styles.loadingPosterStack} ${styles.large}`} />
                    <section className={styles.listInfo}>
                        <div className={styles.loadingListName} />
                        <div className={styles.listStats}>
                            <div className={styles.listDataContainer}>
                                <div className={styles.loadingAvatar} />
                                <div className={styles.loadingUsername} />
                                <div className={styles.loadingUserData} />
                            </div>
                        </div>
                    </section>
                </article>
            ))}
        </>
    );
};

export default LoadingListCardWithData;
