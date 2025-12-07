import type { FunctionComponent } from 'react';
import styles from './ListPage.module.css';
import { useParams } from 'react-router-dom';
import useList from '../hooks/useList';

const ListPage: FunctionComponent = () => {
    const listName = useParams().name || '';

    const { data, isLoading, error } = useList(listName);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !data) {
        return <div>Error loading list: {error?.message}</div>;
    }

    return <section className={styles.listPage}>List Page</section>;
};

export default ListPage;
