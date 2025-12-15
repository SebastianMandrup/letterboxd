import type { FunctionComponent } from 'react';
import type CommentDto from '../../DTO/CommentDto';
import { getApiAvatar } from '../../util/getApiAvatar';
import styles from './listComment.module.css';
import DeleteIcon from '../shared/icons/DeleteIcon';
import { useUserStore } from '../../stores/useUserStore';
import useDeleteComment from '../../hooks/comments/useDeleteComment';
import { useToastStore } from '../../stores/useToastStore';
import { Link } from 'react-router-dom';

interface ListCommentProps {
    comment: CommentDto;
    comments: CommentDto[];
    setComments: (comments: CommentDto[]) => void;
}

const ListComment: FunctionComponent<ListCommentProps> = ({ comment, comments, setComments }) => {
    const { user } = useUserStore();
    const deleteCommentMutation = useDeleteComment();
    const { addToast } = useToastStore();

    const handleClick = async () => {
        deleteCommentMutation.mutate(comment.id, {
            onSuccess: () => {
                const filteredComments = (prevComments: CommentDto[]) => prevComments.filter((c) => c.id !== comment.id);
                // Update comments state
                setComments(filteredComments(comments));
                addToast('Comment deleted successfully', 'success');
            },
            onError: (error) => {
                addToast(error.message, 'error');
            },
        });
    };

    return (
        <article className={styles.comment}>
            <section className={styles.userInfo}>
                <img className={styles.avatar} src={getApiAvatar(comment.user.username)} alt={`${comment.user.username}'s avatar`} />
                <div>
                    <Link className={styles.username} to={`/user/${comment.user.username}`}>
                        {comment.user.username}
                    </Link>
                    <p className={styles.date}>{new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
            </section>
            {user && user.id === comment.user.id && (
                <button className={styles.deleteButton} title="Delete comment" onClick={() => handleClick()}>
                    <DeleteIcon size={24} />
                </button>
            )}
            <p className={styles.content}>{comment.content}</p>
        </article>
    );
};

export default ListComment;
