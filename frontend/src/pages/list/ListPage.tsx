import type { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import useList from '../../hooks/lists/useList';
import Backdrop from '../shared/backdrop/Backdrop';
import { getApiAvatar } from '../../util/getApiAvatar';
import MovieCard from '../shared/movieCard/MovieCard';
import CollapseText from '../shared/collapseText/CollapseText';
import { getMediumPoster } from '../../util/getMediumPoster';
import ListComments from './ListComments';
import styles from './llistPage.module.css';
import LoadingListPage from './LoadingListPage';
import ListLikeButton from './ListLikeButton';

const ListPage: FunctionComponent = () => {
    const listName = useParams().name || '';
    const { data: list, isLoading, error } = useList(listName);

    // TODO: loading and error combined component
    if (isLoading) {
        return <LoadingListPage />;
    }

    if (error || !list) {
        return <div>Error loading list: {error?.message}</div>;
    }

    const firstMovie = list.movies[0];

    return (
        <section className={styles.listPage}>
            <Backdrop backdropPath={firstMovie.backdropPath ? firstMovie.backdropPath : undefined} title={firstMovie.title} />
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
                                src={getMediumPoster(movie.posterPath)}
                                alt={movie.title}
                                overlay={
                                    <div>
                                        <p className={styles.movieIndex}>{index + 1}</p>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                    <ListComments listId={list.id} />
                </section>
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarButtons}>
                        <ListLikeButton listId={list.id} likeCount={list.likeCount} isLiked={list.isLiked} />
                        <button className={styles.cloneButton}>
                            Go <span>PRO</span> to clone
                        </button>
                        <button className={styles.shareButton}>Share</button>
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default ListPage;
