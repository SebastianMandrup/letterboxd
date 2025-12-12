import type { FunctionComponent } from 'react';
import styles from './moviePage.module.css';
import LoadingBackdrop from '../shared/backdrop/LoadingBackdrop';

interface LoadingMoviePageProps {
    error: Error | null;
}

const LoadingMoviePage: FunctionComponent<LoadingMoviePageProps> = ({ error }) => {
    return (
        <>
            <div className="centeredContainer">{error ? <p className="errorMessage">Error loading movie: {error.message}</p> : null}</div>
            <LoadingBackdrop />
            <section className={styles.sectionMovieDetails}>
                <section className={styles.sectionLoadingAside} />
                <section className={styles.sectionMain}>
                    <section className={styles.sectionFirstContent}>
                        <section className={styles.sectionLeft}>
                            <div className={styles.headerMovieDetails}>
                                <div className={styles.loadingMovieTitle}></div>
                                <div className={styles.loadingReleaseYear} />
                            </div>
                            <div className={styles.loadingMovieTagline}></div>
                            <section className={styles.sectionMovieGenres}>
                                <div className={styles.loadingLinkGenre} />
                                <div className={styles.loadingLinkGenre} />
                                <div className={styles.loadingLinkGenre} />
                            </section>
                            <div className={styles.loadingMovieOverview}></div>
                        </section>
                        <section className={styles.sectionRight}>
                            <div className={styles.buttonGroupPlaceholder} />
                        </section>
                    </section>
                </section>
            </section>
        </>
    );
};

export default LoadingMoviePage;
