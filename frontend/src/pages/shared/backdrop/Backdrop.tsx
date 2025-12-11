import type { FunctionComponent } from 'react';
import styles from './backdrop.module.css';

interface BackdropProps {
    src: string;
    title: string;
}

const Backdrop: FunctionComponent<BackdropProps> = ({ src, title }) => {
    const overlay = title.toUpperCase();

    return (
        <section className={styles.sectionBackdrop}>
            <img className={styles.imgBackdrop} src={src} alt={`${title} backdrop`} />
            <span className={styles.spanOverlayCaption}>{overlay}</span>
        </section>
    );
};

export default Backdrop;
