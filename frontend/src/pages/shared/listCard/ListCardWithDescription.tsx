import type { FunctionComponent } from 'react';
import type ListDto from '../../../DTO/ListDto';
import ListPosterStack from './PosterStack';
import styles from './listCardWithDescription.module.css';
import { getApiAvatar } from '../../../util/getApiAvatar';
import HeartIcon from '../icons/HeartIcon';
import CommentIcon from '../icons/CommentIcon';
import { getSlug } from '../../../util/getSlug';
import { Link } from 'react-router-dom';

interface ListCardWithDescriptionProps {
    list: ListDto;
}

const ListCardWithDescription: FunctionComponent<ListCardWithDescriptionProps> = ({ list }) => {
    const description = list.description.slice(0, 100) + (list.description.length > 100 ? '...' : '');

    return (
        <article className={styles.listCardWithDescription}>
            <ListPosterStack list={list} />
            <section>
                <Link to={`/lists/${getSlug(list.name)}`} className={styles.listName}>
                    {list.name}
                </Link>
                <div className={styles.listAuthor}>
                    <img className={styles.avatar} src={getApiAvatar(list.user.username)} alt={list.user.username} />
                    <Link to={`/user/${getSlug(list.user.username)}`} className={styles.aAuthor}>
                        {list.user.username}
                    </Link>

                    <div className={styles.listDataContainer}>
                        <HeartIcon size={24} color="var(--lightBlue)" />
                        {list.likeCount}
                    </div>
                    <div className={styles.listDataContainer}>
                        <CommentIcon size={24} color="var(--lightBlue)" />
                        {list.commentCount}
                    </div>
                </div>
                <p className={styles.description}>{description}</p>
            </section>
        </article>
    );
};

export default ListCardWithDescription;
