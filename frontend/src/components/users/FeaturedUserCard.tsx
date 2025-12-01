import type { FunctionComponent } from 'react';
import type UserDto from '../../DTO/UserDto';
import styles from './featuredUserCard.module.css';
import { getApiAvatar } from '../../services/getApiAvatar';

interface FeaturedUserCardProps {
  user: UserDto;
}

const FeaturedUserCard: FunctionComponent<FeaturedUserCardProps> = ({
  user,
}) => {
  return (
    <article className={styles.card}>
      <img
        className={styles.avatar}
        src={getApiAvatar(user.username)}
        alt={user.username}
      />
      <a className={styles.username} href={`/users/${user.username}`}>
        {user.username}
      </a>
      <div className={styles.stats}>
        <p>{user.numberOfWatchedFilms} films</p>
        <p className="dotSeperator">&bull;</p>
        <p>{user.numberOfReviews} reviews</p>
      </div>
    </article>
  );
};

export default FeaturedUserCard;
