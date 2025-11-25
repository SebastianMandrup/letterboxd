import type { FunctionComponent } from "react";
import SectionHeader from "../components/shared/sectionHeader/SectionHeader";
import useLists from "../hooks/useLists";
import ListCard from "../components/shared/listCard/ListCard";
import styles from "./listsPage.module.css";
import AdBanner from "../components/shared/adBanner/adBanner";

interface ListsPageProps {

}

const ListsPage: FunctionComponent<ListsPageProps> = () => {

	const featuredLists = useLists({ params: { featured: true, pageSize: 10 } });

	const popularLists = useLists({ params: { sortBy: "popularity", pageSize: 3 } });

	return (
		<>
			<header className={styles.listsPageHeader}>
				<h1 className={styles.listsPageTitle}>
					Collect, curate, and share. Lists are the perfect way to group films.
				</h1>
				<button className={styles.startListButton}>
					Start your own list
				</button>
			</header>
			<SectionHeader title="featured lists" subtitle="ALL" link="./lists/featured" />
			<section className={styles.featuredListsSection}>
				{featuredLists.data && featuredLists.data.results.map((list) => (
					<ListCard key={list.id} list={list} />
				))}
			</section>
			<AdBanner />
			<SectionHeader title="featured lists" subtitle="ALL" link="./lists/featured" />
			<section className={styles.featuredListsSection}>
				{popularLists.data && popularLists.data.results.map((list) => (
					<ListCard key={list.id} list={list} large />
				))}
			</section>
		</>
	);
}

export default ListsPage;