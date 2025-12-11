import { type FunctionComponent } from 'react';
import styles from './userPage.module.css';
import useUserByUsername from '../../hooks/useUserByUsername';
import { useParams } from 'react-router-dom';
import Backdrop from '../../components/index/backdrop/Backdrop';
import { getApiAvatar } from '../../services/getApiAvatar';
import UserDataItem from '../../components/user/UserDataItem';
import SectionHeader from '../../components/shared/sectionHeader/SectionHeader';
import ReviewCard from '../../components/shared/reviewCard/ReviewCard';
import ListCard from '../../components/shared/listCard/ListCard';
import FollowButton from '../../components/shared/userCard/FollowButton';

const UserPage: FunctionComponent = () => {
    const username = useParams().username || '';
    // const [content, setContent] = useState<'default' | 'movies' | 'lists' | 'reviews'>('default');
    const { data: user, isLoading, error } = useUserByUsername(username);

    // TODO: loading user page
    if (isLoading) {
        return <div className={styles.div}>Loading...</div>;
    }
    if (error || !user) {
        return <div className={styles.div}>Error loading user data.</div>;
    }

    let lastWatchedMovie;
    if (user.views.length > 0) {
        lastWatchedMovie = user.views[0].movie;
    } else {
        lastWatchedMovie = undefined;
    }

    return (
        <>
            {lastWatchedMovie && lastWatchedMovie.backdropUrl ? (
                <Backdrop src={lastWatchedMovie.backdropUrl || ''} alt={lastWatchedMovie.title} caption={lastWatchedMovie.title} />
            ) : (
                <Backdrop src="/default-backdrop.jpg" alt={lastWatchedMovie ? lastWatchedMovie.title : ''} caption="" />
            )}
            <section className={styles.userSection}>
                <div className={styles.avatarContainer}>
                    <img className={styles.avatar} src={getApiAvatar(user.username)} alt={`${user.username}'s avatar`} />
                    <div className={styles.userInfo}>
                        <h1 className={styles.username}>{user.username}</h1>
                    </div>
                    <FollowButton user={user} />
                </div>
                <div className={styles.userData}>
                    <UserDataItem value={user.views.length} label="movie" />
                    <UserDataItem value={user.lists.length} label="list" />
                    <UserDataItem value={user.reviews.length} label="review" />
                </div>
            </section>

            <section className={styles.userContent}>
                <div>
                    <section className={styles.recentLists}>
                        <SectionHeader title="Recent Lists" />
                        <div className={styles.listsContainer}>
                            {user.lists.length === 0 ? (
                                <p className={styles.noReviewsMessage}>This user has not created any lists yet.</p>
                            ) : (
                                user.lists.slice(0, 3).map((list) => <ListCard key={list.id} list={list} />)
                            )}
                        </div>
                    </section>

                    <section className={styles.recentReviews}>
                        <SectionHeader title="Recent Reviews" />
                        <div>
                            {user.reviews.length === 0 ? (
                                <p className={styles.noReviewsMessage}>This user has not written any reviews yet.</p>
                            ) : (
                                user.reviews.slice(0, 5).map((review) => <ReviewCard key={review.id} review={review} />)
                            )}
                        </div>
                    </section>
                </div>
                <aside>
                    <section className={styles.moreUserData}>
                        <SectionHeader title="Bio" />
                        <div>
                            <p>
                                Member since <span className={styles.memberSince}>{new Date(user.createdAt).toLocaleDateString()}</span>
                            </p>

                            <p>{user.bio ? user.bio : 'This user has not added a bio yet.'}</p>
                        </div>
                    </section>

                    <section className={styles.moreUserData}>
                        <SectionHeader title="Followers" />
                        <div>
                            <p>
                                Member since <span className={styles.memberSince}>{new Date(user.createdAt).toLocaleDateString()}</span>
                            </p>

                            <p>{user.bio ? user.bio : 'This user has not added a bio yet.'}</p>
                        </div>
                    </section>
                </aside>
            </section>
        </>
    );
};

export default UserPage;
