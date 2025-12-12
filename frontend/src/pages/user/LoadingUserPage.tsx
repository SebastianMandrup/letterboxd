import type { FunctionComponent } from 'react';
import LoadingBackdrop from '../shared/backdrop/LoadingBackdrop';
import styles from './userPage.module.css';

interface LoadingUserPageProps {
    error: Error | null;
}

const LoadingUserPage: FunctionComponent<LoadingUserPageProps> = ({ error }) => {
    return (
        <div>
            <LoadingBackdrop />
            <section className={styles.userSection}>
                <div className={styles.avatarContainer}>
                    <div className={styles.avatarLoading} />
                    <div className={styles.userInfo}>
                        <div className={styles.usernameLoading} />
                    </div>
                    <div className={styles.followButton} />
                </div>
                <div className={styles.userData}>
                    <div className={styles.loadingDataItem} />
                    <div className={styles.loadingDataItem} />
                    <div className={styles.loadingDataItem} />
                </div>
            </section>
            <div className={styles.errorMessageContainer}>{error && <p className={styles.errorMessage}>{error.message}</p>}</div>

            <section className={styles.loadingUserContent}>
                <div className={styles.loadingContentMain} />
                <aside className={styles.loadingContentAside} />
            </section>
        </div>
    );
};

export default LoadingUserPage;
