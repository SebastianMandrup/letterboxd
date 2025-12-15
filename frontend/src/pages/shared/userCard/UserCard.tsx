import { type FunctionComponent } from 'react';
import type UserDto from '../../../DTO/UserDto';
import styles from './userCard.module.css';
import { getApiAvatar } from '../../../util/getApiAvatar';
import FollowButton from './FollowButton';
import { Link } from 'react-router-dom';

interface UserCardProps {
    user: UserDto;
}

const UserCard: FunctionComponent<UserCardProps> = ({ user }) => {
    return (
        <article className={styles.userCard}>
            <img className={styles.avatar} src={getApiAvatar(user.username)} alt={user.username} />
            <div className={styles.userInfo}>
                <div>
                    <Link to={`/user/${user.username}`} className={styles.username}>
                        {user.username}
                    </Link>
                    <div className={styles.stats}>
                        <p className={styles.reviewsCount}>{user.numberOfWatchedFilms} films</p>
                        <p className={styles.reviewsCount}>{user.numberOfReviews} reviews</p>
                    </div>
                </div>
                <FollowButton user={user} />
            </div>
        </article>
    );
};

export default UserCard;
