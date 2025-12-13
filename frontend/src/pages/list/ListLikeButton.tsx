import { useState, type FunctionComponent } from 'react';
import styles from './listLikeButton.module.css';
import HeartIcon from '../shared/icons/HeartIcon';
import { useUserStore } from '../../stores/useUserStore';
import { useToastStore } from '../../stores/useToastStore';
import useLikeList from '../../hooks/lists/useLikeList';

interface ListLikeButtonProps {
    listId: number;
    likeCount: number;
    isLiked: boolean;
}

const ListLikeButton: FunctionComponent<ListLikeButtonProps> = ({ listId, likeCount, isLiked }) => {
    const likeListMutation = useLikeList();
    const { addToast } = useToastStore();
    const { user } = useUserStore();
    const [likes, setLikes] = useState(likeCount);
    const [liked, setLiked] = useState(isLiked);

    const handleLike = (listId: number) => {
        if (!user) {
            addToast('You must be logged in to like a list.', 'warning');
            return;
        }

        likeListMutation.mutate(listId, {
            onSuccess: (response) => {
                if (response.message === 'List liked successfully') {
                    addToast('List liked!', 'success');
                    setLikes(likes + 1);
                    setLiked(true);
                } else if (response.message === 'List unliked successfully') {
                    addToast('List unliked!', 'warning');
                    setLikes(likes - 1);
                    setLiked(false);
                }
            },
            onError: (error) => {
                console.error('Error liking the list:', error);
                addToast('Failed to like the list.', 'error');
            },
        });
    };

    return (
        <button className={styles.likeButton + (liked ? ` ${styles.liked}` : '')} title={'Like'} onClick={() => handleLike(listId)}>
            <HeartIcon size={24} color="orange" />
            <span>{likes}</span>
        </button>
    );
};

export default ListLikeButton;
