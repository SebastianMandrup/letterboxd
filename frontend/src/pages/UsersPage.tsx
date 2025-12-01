import type { FunctionComponent } from 'react';
import styles from './usersPage.module.css';
import AdBanner from '../components/shared/adBanner/AdBanner';
import FeaturedMembers from '../components/users/FeaturedMembers';
import PopularMembers from '../components/users/PopularMembers';
import UsersList from '../components/users/UsersList';
import HqUsers from '../components/users/HqUsers';

const UsersPage: FunctionComponent = () => {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Film lovers, critics and friends - find popular members.
        </h1>
      </header>
      <FeaturedMembers />
      <AdBanner />
      <PopularMembers />
      <div className={styles.usersListContainer}>
        <UsersList />
        <HqUsers />
      </div>
    </>
  );
};

export default UsersPage;
