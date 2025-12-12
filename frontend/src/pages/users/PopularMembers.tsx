import type { FunctionComponent } from 'react';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import useUsers from '../../hooks/users/useUsers';
import FeaturedUserCard from './FeaturedUserCard';
import styles from './featuredMembers.module.css';

const PopularMembers: FunctionComponent = () => {
    // TODO: custom hook for initial data?
    const { data, isLoading, error } = useUsers({
        params: { filterBy: 'featured', pageSize: 5 },
    });

    // TODO combined loading/error state

    return (
        <section>
            <SectionHeader title="Popular this week" link="/users/popular" />
            {isLoading && (
                <div className="centeredContainer">
                    <div className="spinner"></div>
                </div>
            )}
            {(error || !data) && <p>Error loading featured members.</p>}
            {data && (
                <ul className={styles.ul}>
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
