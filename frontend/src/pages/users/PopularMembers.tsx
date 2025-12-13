import type { FunctionComponent } from 'react';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import useUsers from '../../hooks/users/useUsers';
import FeaturedUserCard from './FeaturedUserCard';
import styles from './featuredMembers.module.css';
import LoadingFeaturedUserCard from './LoadingFeaturedUserCard';

const PopularMembers: FunctionComponent = () => {
    const { data, isLoading, error } = useUsers({
        params: { filterBy: 'featured', pageSize: 5 },
    });

    return (
        <section>
            <SectionHeader title="Popular this week" link="/users/popular" />
            {data && (
                <ul className={styles.ul}>
                    {isLoading ||
                        (error &&
                            Array.from({ length: 5 }).map((_, index) => (
                                <li key={index}>
                                    <LoadingFeaturedUserCard />
                                </li>
                            )))}
                    {data.results.map((user) => (
                        <li key={user.id}>
                            <FeaturedUserCard user={user} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default PopularMembers;
