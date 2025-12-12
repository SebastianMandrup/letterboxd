import { useEffect, useState, type FunctionComponent } from 'react';
import styles from './followButton.module.css';
import { useToastStore } from '../../../stores/useToastStore';
import { useUserStore } from '../../../stores/useUserStore';
import type UserDto from '../../../DTO/UserDto';
import type PopulatedUserDto from '../../../DTO/PopulatedUserDto';
import useFollowUser from '../../../hooks/users/useFollowUser';

interface FollowButtonProps {
    user: UserDto | PopulatedUserDto;
}

const FollowButton: FunctionComponent<FollowButtonProps> = ({ user }) => {
    const { user: currentUser } = useUserStore();
    const followUser = useFollowUser();
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

        followUser.mutate(user.id, {
            onSuccess: () => {
                setIsFollowed(!isFollowed);
                addToast(isFollowed ? `Unfollowed ${user.username}` : `Followed ${user.username}`, 'success');
            },
            onError: () => {
                addToast('Failed to update follow status. Please try again.', 'error');
            },
        });
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
