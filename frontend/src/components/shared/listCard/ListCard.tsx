import type { FunctionComponent } from 'react';
import type ListDto from '../../../DTO/ListDto';
import styles from './listCard.module.css';
import { getSlug } from '../../../services/getSlug';
import ListPosterStack from './PosterStack';
import { getApiAvatar } from '../../../services/getApiAvatar';

interface ListCardProps {
    list: ListDto;
    large?: boolean;
}

const ListCard: FunctionComponent<ListCardProps> = ({ list, large }) => {
    return (
        <article className={styles.listCard}>
            <ListPosterStack list={list} large={large} />
            <section className={styles.listInfo}>
                <a className={styles.listName + (large ? ` ${styles.large}` : '')} href={`/lists/${getSlug(list.name)}`}>
                    {list.name}
                </a>
                <a className={styles.listAuthor + (large ? ` ${styles.large}` : '')} href={`/users/${getSlug(list.user.username)}`}>
                    <img className={styles.avatar} src={getApiAvatar(list.user.username)} alt={list.user.username} />
                    Created by
                    <span className={styles.username}>{list.user.username}</span>
                </a>
            </section>
        </article>
    );
};

export default ListCard;
