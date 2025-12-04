import type { FunctionComponent } from 'react';
import SectionHeader from '../components/shared/sectionHeader/SectionHeader';
import useLists from '../hooks/useLists';
import ListCard from '../components/shared/listCard/ListCard';
import styles from './listsPage.module.css';
import AdBanner from '../components/shared/adBanner/AdBanner';
import ListCardWithData from '../components/shared/listCard/ListCardWithData';
import ListCardWithDescription from '../components/shared/listCard/ListCardWithDescription';

const ListsPage: FunctionComponent = () => {
    const featuredLists = useLists({
        params: { filterBy: 'featured', pageSize: 10 },
    });

    const popularLists = useLists({
        params: { sortBy: 'popularity', pageSize: 3 },
    });

    const recentlyLikedLists = useLists({
        params: { sortBy: 'recentlyLiked', pageSize: 10 },
    });

    const crewPicksLists = useLists({
        params: { filterBy: 'crewPicks', pageSize: 10 },
    });

    return (
        <>
            <header className={styles.listsPageHeader}>
                <h1 className={styles.listsPageTitle}>Collect, curate, and share. Lists are the perfect way to group films.</h1>
                <button className={styles.startListButton}>Start your own list</button>
            </header>
            <SectionHeader title="featured lists" subtitle="ALL" link="./lists/featured" />
            <section className={styles.featuredListsSection}>
                {featuredLists.data && featuredLists.data.results.map((list) => <ListCard key={list.id} list={list} />)}
            </section>
            <AdBanner />
            <SectionHeader title="popular this week" subtitle="MORE" link="./lists/featured" />
            <section className={styles.featuredListsSection}>
                {popularLists.data && popularLists.data.results.map((list) => <ListCardWithData key={list.id} list={list} large withLikesAndComments />)}
            </section>
            <div id={styles.divRecentlyLikedAndCrewPicks}>
                <section>
                    <SectionHeader title="recently liked lists" />
                    {recentlyLikedLists.data && recentlyLikedLists.data.results.map((list) => <ListCardWithDescription key={list.id} list={list} />)}
                </section>
                <section>
                    <SectionHeader title="crew picks" />
                    {crewPicksLists.data && crewPicksLists.data.results.map((list) => <ListCardWithData key={list.id} list={list} large />)}
                </section>
            </div>
        </>
    );
};

export default ListsPage;
