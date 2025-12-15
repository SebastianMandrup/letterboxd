import type { FunctionComponent } from 'react';
import type UserDto from '../../DTO/UserDto';
import styles from './featuredUserCard.module.css';
import { getApiAvatar } from '../../util/getApiAvatar';
import { Link } from 'react-router-dom';

interface FeaturedUserCardProps {
    user: UserDto;
}

const FeaturedUserCard: FunctionComponent<FeaturedUserCardProps> = ({ user }) => {
    return (
        <article className={styles.card}>
            <img className={styles.avatar} src={getApiAvatar(user.username)} alt={user.username} />
            <Link className={styles.username} to={`/user/${user.username}`}>
                {user.username}
            </Link>
            <div className={styles.stats}>
                <p>{user.numberOfWatchedFilms} films</p>
                <p className="dotSeperator">&bull;</p>
                <p>{user.numberOfReviews} reviews</p>
            </div>
        </article>
    );
};

export default FeaturedUserCard;
