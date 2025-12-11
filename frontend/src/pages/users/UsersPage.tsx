import type { FunctionComponent } from 'react';
import styles from './usersPage.module.css';
import AdBanner from '../shared/adBanner/AdBanner';
import FeaturedMembers from './FeaturedMembers';
import PopularMembers from './PopularMembers';
import UsersList from './UsersList';
import HqUsers from './HqUsers';

const UsersPage: FunctionComponent = () => {
    return (
        <>
            <header className={styles.header}>
                <h1 className={styles.title}>Film lovers, critics and friends - find popular members.</h1>
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
