import type { FunctionComponent } from 'react';
import useUsers from '../../hooks/useUsers';
import SectionHeader from '../shared/sectionHeader/SectionHeader';
import { getApiAvatar } from '../../util/getApiAvatar';
import styles from './hqUsers.module.css';

const HqUsers: FunctionComponent = () => {
    const { data, isLoading, error } = useUsers({
        params: { filterBy: 'hq', pageSize: 10 },
    });

    if (!data || isLoading || error) {
        return null;
    }

    return (
        <section>
            <SectionHeader title="hq members" />
            <ul className={styles.list}>
                {data.results.map((user) => (
                    <li key={user.id} className={styles.listItem}>
                        <button className={styles.button}>
                            <img className={styles.avatar} src={getApiAvatar(user.username)} alt={user.username} />
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default HqUsers;
