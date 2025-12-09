import { useState, type FunctionComponent } from 'react';
import type UserDto from '../../../DTO/UserDto';
import styles from './userCard.module.css';
import { getApiAvatar } from '../../../services/getApiAvatar';
import { useUserStore } from '../../../stores/useUserStore';
import { useToastStore } from '../../../stores/useToastStore';
import userService from '../../../services/userService';

interface UserCardProps {
    user: UserDto;
}

const UserCard: FunctionComponent<UserCardProps> = ({ user }) => {
    const { addToast } = useToastStore();
    const { user: currentUser } = useUserStore();
    const [isFollowing, setIsFollowing] = useState(user.isFollowed);

    const handleFollow = async () => {
        if (!currentUser) {
            addToast('You must be logged in to follow users.', 'warning');
            return;
        }

        try {
            const response = await userService.followUser(user.id);

            if (response.error) {
                addToast(response.error, 'error');
                return;
            }

            if (response.message === 'Followed successfully') {
                setIsFollowing(true);
                addToast(`You are now following ${user.username}.`, 'success');
            } else if (response.message === 'Unfollowed successfully') {
                setIsFollowing(false);
                addToast(`You have unfollowed ${user.username}.`, 'warning');
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
            addToast('An error occurred. Please try again later.', 'error');
        }
    };

    return (
        <article className={styles.userCard}>
            <img className={styles.avatar} src={getApiAvatar(user.username)} alt={user.username} />
            <div className={styles.userInfo}>
                <div>
                    <a href={`/user/${user.username}`} className={styles.username}>
                        {user.username}
                    </a>
                    <div className={styles.stats}>
                        <p className={styles.reviewsCount}>{user.numberOfWatchedFilms} films</p>
                        <p className={styles.reviewsCount}>{user.numberOfReviews} reviews</p>
                    </div>
                </div>
                {!isFollowing ? (
                    <button className={styles.followButton} title="Follow user" onClick={handleFollow}>
                        &#43;
                    </button>
                ) : (
                    <button className={styles.unfollowButton} title="Unfollow user" onClick={handleFollow}>
                        &#8722;
                    </button>
                )}
            </div>
        </article>
    );
};

export default UserCard;
