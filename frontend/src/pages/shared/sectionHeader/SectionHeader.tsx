import type { FunctionComponent } from 'react';
import styles from './sectionHeader.module.css';
import { Link } from 'react-router-dom';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    link?: string;
    large?: boolean;
}

const SectionHeader: FunctionComponent<SectionHeaderProps> = ({ title, subtitle, link, large }) => {
    title = title.toUpperCase();
    return (
        <header className={styles.sectionHeader + (large ? ` ${styles.largeHeader}` : '')}>
            {title}

            {link && (
                <Link to={link} className={styles.subtitle}>
                    {subtitle ? subtitle : 'MORE'}
                </Link>
            )}

            {!link && subtitle && <p>{subtitle}</p>}
        </header>
    );
};

export default SectionHeader;
