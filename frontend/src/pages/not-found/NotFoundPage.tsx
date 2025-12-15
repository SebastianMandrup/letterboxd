import type { FunctionComponent } from 'react';
import styles from './notFoundPage.module.css';

const NotFoundPage: FunctionComponent = () => {
    return (
        <section className={styles.notFoundSection}>
            <h1 className={styles.notFoundTitle}>404 - Page Not Found</h1>
            <p className={styles.notFoundMessage}>Sorry, the page you are looking for does not exist.</p>
        </section>
    );
};

export default NotFoundPage;
