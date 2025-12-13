import type { FunctionComponent } from 'react';
import useUsers from '../../hooks/users/useUsers';
import styles from './usersList.module.css';
import UserCard from '../shared/userCard/UserCard';

const UsersList: FunctionComponent = () => {
    const { data, isLoading, error } = useUsers({
        params: { sortBy: 'popular', pageSize: 20 },
    });

    return (
        <section>
            <ul className={styles.usersList}>
                {isLoading && <p className={styles.loading}>Loading users...</p>}
                {error && <p className={styles.error}>Error loading users: {error.message}</p>}
                {data?.results.map((user) => (
                    <li className={styles.userItem} key={user.id}>
                        <UserCard user={user} />
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default UsersList;
