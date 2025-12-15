import type { FunctionComponent } from 'react';
import type ListDto from '../../../DTO/ListDto';
import { getApiAvatar } from '../../../util/getApiAvatar';
import { getSlug } from '../../../util/getSlug';
import styles from './listCard.module.css';
import ListPosterStack from './PosterStack';
import { Link } from 'react-router-dom';

interface ListCardProps {
    list: ListDto;
    large?: boolean;
}

const ListCard: FunctionComponent<ListCardProps> = ({ list, large }) => {
    return (
        <article className={styles.listCard}>
            <ListPosterStack list={list} large={large} />
            <section className={styles.listInfo}>
                <Link className={styles.listName + (large ? ` ${styles.large}` : '')} to={`/lists/${getSlug(list.name)}`}>
                    {list.name}
                </Link>
                <Link className={styles.listAuthor + (large ? ` ${styles.large}` : '')} to={`/user/${getSlug(list.user.username)}`}>
                    <img className={styles.avatar} src={getApiAvatar(list.user.username)} alt={list.user.username} />
                    Created by
                    <span className={styles.username}>{list.user.username}</span>
                </Link>
            </section>
        </article>
    );
};

export default ListCard;
