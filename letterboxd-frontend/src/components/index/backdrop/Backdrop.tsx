import type { FunctionComponent } from 'react';
import styles from './backdrop.module.css';

interface BackdropProps {
    src: string;
    alt: string;
    caption: string;
}

const Backdrop: FunctionComponent<BackdropProps> = ({ src, alt, caption }) => {
    return (
        <section className={styles.sectionBackdrop}>
            <img className={styles.imgBackdrop} src={src} alt={alt} />
            <span className={styles.spanOverlayCaption}>{caption}</span>
        </section>
    );
}

export default Backdrop;