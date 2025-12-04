import type { FunctionComponent } from 'react';
import type UserDto from '../../../DTO/UserDto';
import styles from './userCard.module.css';
import { getApiAvatar } from '../../../services/getApiAvatar';

interface UserCardProps {
    user: UserDto;
}

const UserCard: FunctionComponent<UserCardProps> = ({ user }) => {
    return (
        <article className={styles.userCard}>
            <img className={styles.avatar} src={getApiAvatar(user.username)} alt={user.username} />
            <div className={styles.userInfo}>
                <div>
                    <a href={`/users/${user.username}`} className={styles.username}>
                        {user.username}
                    </a>
                    <div className={styles.stats}>
                        <p className={styles.reviewsCount}>{user.numberOfWatchedFilms} films</p>
                        <p className={styles.reviewsCount}>{user.numberOfReviews} reviews</p>
                    </div>
                </div>
                <button className={styles.followButton} title="Follow user">
                    &#43;
                </button>
            </div>
        </article>
    );
};

export default UserCard;
