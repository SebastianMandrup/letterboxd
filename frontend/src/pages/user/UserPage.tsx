import { useState, type FunctionComponent } from 'react';
import styles from './userPage.module.css';
import useUserByUsername from '../../hooks/users/useUserByUsername';
import { useParams } from 'react-router-dom';
import Backdrop from '../shared/backdrop/Backdrop';
import { getApiAvatar } from '../../util/getApiAvatar';
import UserDataItem from './UserDataItem';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import FollowButton from '../shared/userCard/FollowButton';
import DefaultUserContent from './content/DefaultUserContent';
import WatchedMoviesUserContent from './content/WatchedMoviesUserContent';
import ListsUserContent from './content/ListsUserContent';
import ReviewsUserContent from './content/ReviewsUserContent';
import useFollowers from '../../hooks/users/useFollowers';
import useFollowing from '../../hooks/users/useFollowing';
import LoadingUserPage from './LoadingUserPage';

const UserPage: FunctionComponent = () => {
    const username = useParams().username || '';
    const [content, setContent] = useState<'default' | 'movies' | 'lists' | 'reviews'>('default');

    const { data: user, isLoading, error } = useUserByUsername(username);
    const { data: followers } = useFollowers(username);
    const { data: following } = useFollowing(username);

    if (isLoading || error || !user) {
        return <LoadingUserPage error={error} />;
    }

    let lastWatchedMovie;
    if (user.views.length > 0) {
        lastWatchedMovie = user.views[0].movie;
    } else {
        lastWatchedMovie = undefined;
    }

    const renderContent = () => {
        switch (content) {
            case 'movies':
                return <WatchedMoviesUserContent views={user.views} />;
            case 'lists':
                return <ListsUserContent lists={user.lists} />;
            case 'reviews':
                return <ReviewsUserContent reviews={user.reviews} />;
            default:
                return <DefaultUserContent recentLists={user.lists} recentReviews={user.reviews} />;
        }
    };

    return (
        <>
            <Backdrop backdropPath={lastWatchedMovie?.backdropPath} title={lastWatchedMovie?.title || 'default'} />
            <section className={styles.userSection}>
                <div className={styles.avatarContainer}>
                    <img className={styles.avatar} src={getApiAvatar(user.username)} alt={`${user.username}'s avatar`} />
                    <div className={styles.userInfo}>
                        <h1 className={styles.username}>{user.username}</h1>
                    </div>
                    <FollowButton user={user} />
                </div>
                <div className={styles.userData}>
                    <UserDataItem value={user.views.length} label="movies" setContent={setContent} />
                    <UserDataItem value={user.lists.length} label="lists" setContent={setContent} />
                    <UserDataItem value={user.reviews.length} label="reviews" setContent={setContent} />
                </div>
            </section>

            <section className={styles.userContent}>
                {renderContent()}
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
                            {followers && followers.length > 0 ? (
                                <ul className={styles.followersList}>
                                    {followers.map((follower) => (
                                        <li key={follower.id} className={styles.followerItem}>
                                            <a href={`/user/${follower.username}`} title={follower.username}>
                                                <img
                                                    className={styles.followerAvatar}
                                                    src={getApiAvatar(follower.username)}
                                                    alt={`${follower.username}'s avatar`}
                                                />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>This user has no followers yet.</p>
                            )}
                        </div>
                    </section>

                    <section className={styles.moreUserData}>
                        <SectionHeader title="Following" />
                        <div>
                            {following && following.length > 0 ? (
                                <ul className={styles.followingList}>
                                    {following.map((followedUser) => (
                                        <li key={followedUser.id} className={styles.followingItem}>
                                            <a href={`/user/${followedUser.username}`} title={followedUser.username}>
                                                <img
                                                    className={styles.followingAvatar}
                                                    src={getApiAvatar(followedUser.username)}
                                                    alt={`${followedUser.username}'s avatar`}
                                                />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>This user is not following anyone yet.</p>
                            )}
                        </div>
                    </section>
                </aside>
            </section>
        </>
    );
};

export default UserPage;
