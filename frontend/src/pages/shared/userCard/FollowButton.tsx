import { useEffect, useState, type FunctionComponent } from 'react';
import styles from './followButton.module.css';
import { useToastStore } from '../../../stores/useToastStore';
import { useUserStore } from '../../../stores/useUserStore';
import userService from '../../../services/userService';
import type UserDto from '../../../DTO/UserDto';
import type PopulatedUserDto from '../../../DTO/PopulatedUserDto';

interface FollowButtonProps {
    user: UserDto | PopulatedUserDto;
}

const FollowButton: FunctionComponent<FollowButtonProps> = ({ user }) => {
    const { user: currentUser } = useUserStore();

    const [isFollowed, setIsFollowed] = useState(user.isFollowed);
    const { addToast } = useToastStore();

    useEffect(() => {
        setIsFollowed(user.isFollowed);
    }, [user.isFollowed]);

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
                setIsFollowed(true);
                addToast(`You are now following ${user.username}.`, 'success');
            } else if (response.message === 'Unfollowed successfully') {
                setIsFollowed(false);
                addToast(`You have unfollowed ${user.username}.`, 'warning');
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
            addToast('An error occurred. Please try again later.', 'error');
        }
    };

    // don't render the anything if its user's own page
    if (currentUser?.id === user.id) {
        return null;
    }

    return (
        <>
            {!isFollowed ? (
                <button className={styles.followButton} title="Follow user" onClick={handleFollow}>
                    &#43;
                </button>
            ) : (
                <button className={styles.unfollowButton} title="Unfollow user" onClick={handleFollow}>
                    &#8722;
                </button>
            )}
        </>
    );
};

export default FollowButton;
