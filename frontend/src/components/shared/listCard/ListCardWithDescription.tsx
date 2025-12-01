import type { FunctionComponent } from 'react';
import type ListDto from '../../../DTO/ListDto';
import ListPosterStack from './PosterStack';
import styles from './listCardWithDescription.module.css';
import { getApiAvatar } from '../../../services/getApiAvatar';

interface ListCardWithDescriptionProps {
  list: ListDto;
}

const ListCardWithDescription: FunctionComponent<
  ListCardWithDescriptionProps
> = ({ list }) => {
  const description =
    list.description.slice(0, 120) +
    (list.description.length > 120 ? '...' : '');

  return (
    <article className={styles.listCardWithDescription}>
      <ListPosterStack list={list} />
      <section>
        <h2 className={styles.listName}>{list.name}</h2>
        <div className={styles.listAuthor}>
          <img
            className={styles.avatar}
            src={getApiAvatar(list.user.username)}
            alt={list.user.username}
          />
          <a className={styles.aAuthor} href={`/user/${list.user.username}`}>
            {list.user.username}
          </a>

          <div className={styles.listDataContainer}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Liked"
            >
              <path
                d="M12 21.4s-6.7-4.6-9.3-7.3C.9 11.9 1 7.9 4.3 5.9 6.1 4.7 8.4 5 10 6.3c.9.8 1.6 1.6 2 2 .4-.4 1.1-1.2 2-2 1.6-1.3 3.9-1.6 5.7-.4 3.3 2 3.4 6 1.6 8.2-2.6 2.7-9.3 7.3-9.3 7.3z"
                fill="currentColor"
              />
            </svg>
            {list.likeCount}
          </div>
          <div className={styles.listDataContainer}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Comment"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {list.commentCount}
          </div>
        </div>
        <p>{description}</p>
      </section>
    </article>
  );
};

export default ListCardWithDescription;
