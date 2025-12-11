import type { FunctionComponent } from 'react';
import type ListDto from '../../../DTO/ListDto';
import ListPosterStack from './PosterStack';
import styles from './listCardWithDescription.module.css';
import { getApiAvatar } from '../../../services/getApiAvatar';
import HeartIcon from '../icons/HeartIcon';
import CommentIcon from '../icons/CommentIcon';
import { getSlug } from '../../../services/getSlug';

interface ListCardWithDescriptionProps {
    list: ListDto;
}

const ListCardWithDescription: FunctionComponent<ListCardWithDescriptionProps> = ({ list }) => {
    const description = list.description.slice(0, 100) + (list.description.length > 100 ? '...' : '');

    return (
        <article className={styles.listCardWithDescription}>
            <ListPosterStack list={list} />
            <section>
                <a href={`/lists/${getSlug(list.name)}`} className={styles.listName}>
                    {list.name}
                </a>
                <div className={styles.listAuthor}>
                    <img className={styles.avatar} src={getApiAvatar(list.user.username)} alt={list.user.username} />
                    <a className={styles.aAuthor} href={`/user/${list.user.username}`}>
                        {list.user.username}
                    </a>

                    <div className={styles.listDataContainer}>
                        <HeartIcon size={24} color="var(--lightBlue)" />
                        {list.likeCount}
                    </div>
                    <div className={styles.listDataContainer}>
                        <CommentIcon size={24} color="var(--lightBlue)" />
                        {list.commentCount}
                    </div>
                </div>
                <p>{description}</p>
            </section>
        </article>
    );
};

export default ListCardWithDescription;
