import ListCard from '../../shared/listCard/ListCard';
import SectionHeader from '../../shared/sectionHeader/SectionHeader';
import styles from './sectionPopularLists.module.css';
import SectionPopularReviewers from '../../shared/sectionPopularReviewers/SectionPopularReviewers';
import usePopularLists from '../../../hooks/lists/usePopularLists';

function SectionPopularLists() {
    const popularLists = usePopularLists();

    return (
        <section id={styles.sectionPopularLists}>
            <SectionHeader title="POPULAR LISTS" link="/lists/popular" />
            {popularLists.data &&
                popularLists.data.results.map((list) => {
                    return <ListCard key={list.id} list={list} />;
                })}
            <SectionPopularReviewers />
        </section>
    );
}

export default SectionPopularLists;
