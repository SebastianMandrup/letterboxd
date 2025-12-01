import type { FunctionComponent } from 'react';
import useUsers from '../../hooks/useUsers';
import styles from './usersList.module.css';
import UserCard from '../shared/userCard/UserCard';

const UsersList: FunctionComponent = () => {
  const { data, isLoading, error } = useUsers({
    params: { sortBy: 'popular', pageSize: 20 },
  });

  return (
    <section>
      {isLoading && (
        <tr>
          <td>Loading...</td>
        </tr>
      )}
      {error && (
        <tr>
          <td>Error loading users.</td>
        </tr>
      )}
      <ul className={styles.usersList}>
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
