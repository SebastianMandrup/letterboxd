import type React from 'react';
import type { FunctionComponent } from 'react';
import styles from './movieCard.module.css';
import { getSlug } from '../../../services/getSlug';

interface MovieCardProps {
  title: string;
  src: string;
  alt: string;
  overlay?: React.ReactNode;
}

const MovieCard: FunctionComponent<MovieCardProps> = ({
  title,
  src,
  alt,
  overlay,
}) => {
  const handleClick = () => {
    const movieSlug = getSlug(title);
    location.href = `/movie/${movieSlug}`;
  };

  return (
    <button className={styles.articleMovie} onClick={handleClick}>
      <img src={src} alt={alt} />
      {overlay && overlay}
    </button>
  );
};

export default MovieCard;
