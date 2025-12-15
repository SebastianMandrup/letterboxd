import type { FunctionComponent } from 'react';
import type ListDto from '../../../DTO/ListDto';
import styles from './listCard.module.css';
import { getSlug } from '../../../util/getSlug';
import ListPosterStack from './PosterStack';
import { getApiAvatar } from '../../../util/getApiAvatar';
import CommentIcon from '../icons/CommentIcon';
import HeartIcon from '../icons/HeartIcon';
import { Link } from 'react-router-dom';

interface ListCardWithDataProps {
    list: ListDto;
    large?: boolean;
    withLikesAndComments?: boolean;
}

const ListCardWithData: FunctionComponent<ListCardWithDataProps> = ({ list, large, withLikesAndComments }) => {
    return (
        <article className={styles.listCard}>
            <ListPosterStack list={list} large={large} />
            <section className={styles.listInfo}>
                <Link className={styles.listName + (large ? ` ${styles.large}` : '')} to={`/lists/${getSlug(list.name)}`}>
                    {list.name}
                </Link>
                <div className={styles.listStats}>
                    <Link className={styles.listAuthor + (large ? ` ${styles.large}` : '')} to={`/user/${getSlug(list.user.username)}`}>
                        <img className={styles.avatar} src={getApiAvatar(list.user.username)} alt={list.user.username} />
                        <span className={styles.username}>{list.user.username}</span>
                    </Link>
                    <p className={styles.movieCount + (large ? ` ${styles.large}` : '')}>{list.movies.length} movies</p>
                    {withLikesAndComments && (
                        <>
                            <div className={styles.listDataContainer}>
                                <HeartIcon size={24} color="var(--lightBlue)" />
                                {list.likeCount}
                            </div>
                            <div className={styles.listDataContainer}>
                                <CommentIcon size={24} color="var(--lightBlue)" />
                                {list.commentCount}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </article>
    );
};

export default ListCardWithData;
