import type { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import useList from '../../hooks/useList';
import Backdrop from '../../components/index/backdrop/Backdrop';
import { getApiAvatar } from '../../services/getApiAvatar';
import MovieCard from '../../components/shared/movieCard/MovieCard';
import CollapseText from '../../components/users/CollapseText';
import { getMediumPoster } from '../../services/getMediumPoster';
import Heart from '../../components/shared/icons/HeartIcon';
import ListComments from '../../components/list/ListComments';
import styles from './llistPage.module.css';

const ListPage: FunctionComponent = () => {
    const listName = useParams().name || '';

    const { data: list, isLoading, error } = useList(listName);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !list) {
        return <div>Error loading list: {error?.message}</div>;
    }

    const firstMovie = list.movies[0];

    return (
        <section className={styles.listPage}>
            <Backdrop src={firstMovie.backdropUrl ? firstMovie.backdropUrl : 'default-backdrop.jpg'} alt={firstMovie.title} caption={firstMovie.title} />
            <div className={styles.contentContainer}>
                <section>
                    <div className={styles.userInfo}>
                        <img className={styles.avatar} src={getApiAvatar(list.user.username)} alt={`${list.user.username}'s avatar`} />
                        <p>
                            List by
                            <span className={styles.username}>{list.user.username}</span>
                        </p>
                    </div>
                    <div className={styles.publishDate}>
                        <p>
                            Published on
                            <span className={styles.publishedDate}>{new Date(list.createdAt).toLocaleDateString()}</span>
                        </p>
                    </div>
                    <div>
                        <h1 className={styles.listName}>{list.name}</h1>
                        <div className={styles.description}>
                            <CollapseText text={list.description} length={200} />
                        </div>
                    </div>

                    <div className={styles.moviesGrid}>
                        {list.movies.map((movie, index) => (
                            <MovieCard
                                key={movie.id}
                                title={movie.title}
                                src={getMediumPoster(movie.posterUrl)}
                                alt={movie.title}
                                overlay={
                                    <div>
                                        <p className={styles.movieIndex}>{index + 1}</p>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                    <ListComments id={list.id} />
                </section>
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarButtons}>
                        <button className={styles.likeButton}>
                            <Heart size={32} color="var(--orange)" />
                            Like this list?
                        </button>
                        <button className={styles.cloneButton}>Go PRO to clone or see stats</button>
                        <button className={styles.shareButton}>Share</button>
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default ListPage;
