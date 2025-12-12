import type { FunctionComponent } from 'react';
import styles from './backdrop.module.css';
import LoadingBackdrop from './LoadingBackdrop';
import { getMovieBackdrop } from '../../../util/getMovieBackdrop';

interface BackdropProps {
    backdropPath: string | null | undefined;
    title: string;
}

const Backdrop: FunctionComponent<BackdropProps> = ({ backdropPath, title }) => {
    const backdropSrc = getMovieBackdrop(backdropPath);

    if (!backdropSrc || !title) {
        return <LoadingBackdrop />;
    }

    const overlay = title.toUpperCase();

    return (
        <section className={styles.sectionBackdrop}>
            <img className={styles.imgBackdrop} src={backdropSrc} alt={`${title} backdrop`} />
            <span className={styles.spanOverlayCaption}>{overlay}</span>
        </section>
    );
};

export default Backdrop;
