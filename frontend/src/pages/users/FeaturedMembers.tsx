import type { FunctionComponent } from 'react';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import useUsers from '../../hooks/users/useUsers';
import FeaturedUserCard from './FeaturedUserCard';
import styles from './featuredMembers.module.css';
import LoadingFeaturedUserCard from './LoadingFeaturedUserCard';

const FeaturedMembers: FunctionComponent = () => {
    const { data, isLoading, error } = useUsers({
        params: { sortBy: 'popular', pageSize: 5 },
    });

    return (
        <section>
            <SectionHeader title="Featured Members" />
            <ul className={styles.ul}>
                {isLoading &&
                    Array.from({ length: 5 }).map((_, index) => (
                        <li key={index}>
                            <LoadingFeaturedUserCard />
                        </li>
                    ))}
                {error && <p className={styles.error}>Failed to load featured members.</p>}
                {data &&
                    data.results.map((user) => (
                        <li key={user.id}>
                            <FeaturedUserCard user={user} />
                        </li>
                    ))}
            </ul>
        </section>
    );
};

export default FeaturedMembers;
