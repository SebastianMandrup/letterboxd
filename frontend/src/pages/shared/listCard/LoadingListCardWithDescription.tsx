import type { FunctionComponent } from 'react';
import styles from './listCardWithDescription.module.css';

interface LoadingListCardWithDescriptionProps {
    count?: number;
}

const LoadingListCardWithDescription: FunctionComponent<LoadingListCardWithDescriptionProps> = ({ count = 1 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <article className={styles.listCardWithDescription} key={index}>
                    <div className={styles.loadingPosterStack} />
                    <section>
                        <div className={styles.loadingListName} />
                        <div className={styles.loadingListAuthorContainer}>
                            <div className={styles.loadingAvatar} />
                            <div className={styles.loadingAuthor}></div>

                            <div className={styles.loadingListDataContainer}>
                                <div className={styles.loadingListDataItem}></div>
                            </div>
                            <div className={styles.loadingListDataContainer}>
                                <div className={styles.loadingListDataItem}></div>
                            </div>
                        </div>
                        <div className={styles.loadingListDescription}></div>
                    </section>
                </article>
            ))}
        </>
    );
};

export default LoadingListCardWithDescription;
