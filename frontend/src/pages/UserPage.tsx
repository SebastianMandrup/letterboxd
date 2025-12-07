import type { FunctionComponent } from 'react';
import styles from './userPage.module.css';
import useUserByUsername from '../hooks/useUserByUsername';
import { useParams } from 'react-router-dom';
import Backdrop from '../components/index/backdrop/Backdrop';
import { getApiAvatar } from '../services/getApiAvatar';
import UserDataItem from '../components/user/UserDataItem';
import SectionHeader from '../components/shared/sectionHeader/SectionHeader';
import ReviewCard from '../components/shared/reviewCard/ReviewCard';
import ListCard from '../components/shared/listCard/ListCard';

const UserPage: FunctionComponent = () => {
    const username = useParams().username || '';

    const { data, isLoading, error } = useUserByUsername(username);

    if (isLoading) {
        return <div className={styles.div}>Loading...</div>;
    }
    if (error || !data) {
        return <div className={styles.div}>Error loading user data.</div>;
    }

    const lastWatchedMovie = data.views[0].movie;

    return (
        <>
            {lastWatchedMovie.backdropUrl ? (
                <Backdrop src={lastWatchedMovie.backdropUrl || ''} alt={lastWatchedMovie.title} caption={lastWatchedMovie.title} />
            ) : (
                <Backdrop src="/default-backdrop.jpg" alt={lastWatchedMovie.title} caption="" />
            )}
            <section className={styles.userSection}>
                <div className={styles.avatarContainer}>
                    <img className={styles.avatar} src={getApiAvatar(data.username)} alt={`${data.username}'s avatar`} />
                    <div className={styles.userInfo}>
                        <h1 className={styles.username}>{data.username}</h1>
                    </div>
                    <button className={styles.moreOptionsButton} aria-label="More options">
                        ...
                    </button>
                </div>
                <div className={styles.userData}>
                    <UserDataItem value={data.views.length} label="movie" />
                    <UserDataItem value={data.lists.length} label="list" />
                    <UserDataItem value={data.reviews.length} label="review" />
                </div>
            </section>

            <div className={styles.userContent}>
                <section className={styles.recentReviews}>
                    <SectionHeader title="Recent Reviews" />
                    <div>
                        {data.reviews.length === 0 ? (
                            <p className={styles.noReviewsMessage}>This user has not written any reviews yet.</p>
                        ) : (
                            data.reviews.slice(0, 5).map((review) => <ReviewCard key={review.id} review={review} />)
                        )}
                    </div>
                </section>

                <div>
                    <section className={styles.moreUserData}>
                        <SectionHeader title="Bio" />
                        <div>
                            <p>Member since 12/11/2011</p>

                            <p>
                                Looking at my average ratings I might seem a bit too generous... The thing is, I started choosing movies to watch in a different
                                way since I started using Letterboxd.
                            </p>
                        </div>
                    </section>

                    <section>
                        <SectionHeader title="Recent Lists" />
                        {data.lists.length === 0 ? (
                            <p className={styles.noReviewsMessage}>This user has not created any lists yet.</p>
                        ) : (
                            data.lists.slice(0, 3).map((list) => <ListCard key={list.id} list={list} />)
                        )}
                    </section>
                </div>
            </div>
        </>
    );
};

export default UserPage;
