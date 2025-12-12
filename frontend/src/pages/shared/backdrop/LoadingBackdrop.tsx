import type { FunctionComponent } from 'react';
import styles from './backdrop.module.css';

const LoadingBackdrop: FunctionComponent = () => {
    return (
        <section className={styles.sectionBackdrop}>
            <div className={`${styles.imgLoadingBackdrop} pulsing`} />
        </section>
    );
};

export default LoadingBackdrop;
