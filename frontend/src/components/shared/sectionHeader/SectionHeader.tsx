import type { FunctionComponent } from 'react';
import styles from './sectionHeader.module.css';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  link?: string;
  large?: boolean;
}

const SectionHeader: FunctionComponent<SectionHeaderProps> = ({
  title,
  subtitle,
  link,
  large,
}) => {
  title = title.toUpperCase();
  return (
    <header
      className={styles.sectionHeader + (large ? ` ${styles.largeHeader}` : '')}
    >
      {title}

      {link && (
        <a href={link} className={styles.subtitle}>
          {subtitle ? subtitle : 'MORE'}
        </a>
      )}

      {!link && subtitle && <p>{subtitle}</p>}
    </header>
  );
};

export default SectionHeader;
