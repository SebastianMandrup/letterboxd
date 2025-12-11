import type { FunctionComponent } from 'react';
import LoadingBackdrop from '../shared/backdrop/LoadingBackdrop';
import styles from './llistPage.module.css';
import LoadingMovieCard from '../shared/movieCard/LoadingMovieCard';

const LoadingListPage: FunctionComponent = () => {
    return (
        <section className={styles.listPage}>
            <LoadingBackdrop />
            <div className={styles.contentContainer}>
                <section>
                    <div className={styles.userInfo}>
                        <div className={`${styles.loadingAvatar} pulsing`} />
                        <div className={`${styles.loadingUsername} pulsing`} />
                    </div>
                    <div className={`${styles.loadingPublishDate} pulsing`}></div>
                    <div>
                        <div className={`${styles.loadingListName} pulsing`}></div>
                        <div className={`${styles.loadingDescription} pulsing`}></div>
                    </div>
                    <div className={styles.moviesGrid}>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <LoadingMovieCard key={index} />
                        ))}
                    </div>
                </section>
                <aside className={styles.sidebar}>
                    <div className={`${styles.loadingSidebarBox} pulsing`}></div>
                </aside>
            </div>
        </section>
    );
};

export default LoadingListPage;
