import type { FunctionComponent } from 'react';
import type CommentDto from '../../DTO/CommentDto';
import { getApiAvatar } from '../../services/getApiAvatar';
import styles from './ListComment.module.css';

interface ListCommentProps {
    comment: CommentDto;
}

const ListComment: FunctionComponent<ListCommentProps> = ({ comment }) => {
    return (
        <article className={styles.comment}>
            <section className={styles.userInfo}>
                <img className={styles.avatar} src={getApiAvatar(comment.user.username)} alt={`${comment.user.username}'s avatar`} />
                <div>
                    <a className={styles.username} href={`/user/${comment.user.username}`}>
                        {comment.user.username}
                    </a>
                    <p className={styles.date}>{new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
            </section>
            <p className={styles.content}>{comment.content}</p>
        </article>
    );
};

export default ListComment;
