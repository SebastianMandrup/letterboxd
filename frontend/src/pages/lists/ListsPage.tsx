import type { FunctionComponent } from 'react';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import useLists from '../../hooks/lists/useLists';
import ListCard from '../shared/listCard/ListCard';
import styles from './listsPage.module.css';
import AdBanner from '../shared/adBanner/AdBanner';
import ListCardWithData from '../shared/listCard/ListCardWithData';
import ListCardWithDescription from '../shared/listCard/ListCardWithDescription';
import { useUserStore } from '../../stores/useUserStore';
import LoadingListCard from '../shared/listCard/LoadingListCard';
import LoadingListCardWithData from '../shared/listCard/LoadingListCardWithData';
import LoadingListCardWithDescription from '../shared/listCard/LoadingListCardWithDescription';
import { Link } from 'react-router-dom';

const ListsPage: FunctionComponent = () => {
    const user = useUserStore((state) => state.user);

    const numberOfFeaturedListsToShow = 4;
    const numberOfPopularListsToShow = 3;
    const numberOfRecentlyLikedListsToShow = 10;
    const numberOfCrewPicksListsToShow = 10;

    const featuredLists = useLists({
        params: { filterBy: 'featured', pageSize: numberOfFeaturedListsToShow },
    });

    const popularLists = useLists({
        params: { sortBy: 'popularity', pageSize: numberOfPopularListsToShow },
    });

    const recentlyLikedLists = useLists({
        params: { sortBy: 'recentlyLiked', pageSize: numberOfRecentlyLikedListsToShow },
    });

    const crewPicksLists = useLists({
        params: { filterBy: 'crewPicks', pageSize: numberOfCrewPicksListsToShow },
    });

    return (
        <>
            <header className={styles.listsPageHeader}>
                <h1 className={styles.listsPageTitle}>Collect, curate, and share. Lists are the perfect way to group films.</h1>

                {user ? (
                    <Link to="/lists/new" className={styles.startListLink}>
                        Start your own list
                    </Link>
                ) : (
                    <p className={styles.startListLink}>Log in to start your own list</p>
                )}
            </header>
            <SectionHeader title="featured lists" subtitle="ALL" link="./lists/featured" />
            <section className={styles.featuredListsSection}>
                {featuredLists.data ? (
                    featuredLists.data.results.map((list) => <ListCard key={list.id} list={list} />)
                ) : (
                    <LoadingListCard count={numberOfFeaturedListsToShow} />
                )}
            </section>
            <AdBanner />
            <SectionHeader title="popular this week" subtitle="MORE" link="./lists/featured" />
            <section className={styles.featuredListsSection}>
                {popularLists.data ? (
                    popularLists.data.results.map((list) => <ListCardWithData key={list.id} list={list} large withLikesAndComments />)
                ) : (
                    <LoadingListCardWithData count={numberOfPopularListsToShow} />
                )}
            </section>
            <div id={styles.divRecentlyLikedAndCrewPicks}>
                <section>
                    <SectionHeader title="recently liked lists" />
                    {recentlyLikedLists.data ? (
                        recentlyLikedLists.data.results.map((list) => <ListCardWithDescription key={list.id} list={list} />)
                    ) : (
                        <LoadingListCardWithDescription count={numberOfRecentlyLikedListsToShow} />
                    )}
                </section>
                <section>
                    <SectionHeader title="crew picks" />
                    <div className={styles.crewPicksLists}>
                        {crewPicksLists.data ? (
                            crewPicksLists.data.results.map((list) => <ListCardWithData key={list.id} list={list} large />)
                        ) : (
                            <LoadingListCardWithData count={numberOfCrewPicksListsToShow} />
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default ListsPage;
