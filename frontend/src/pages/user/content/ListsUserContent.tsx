import type { FunctionComponent } from 'react';
import type ListDto from '../../../DTO/ListDto';
import SectionHeader from '../../../components/shared/sectionHeader/SectionHeader';
import styles from './listsUserContent.module.css';

interface ListsUserContentProps {
    lists: ListDto[];
}

const ListsUserContent: FunctionComponent<ListsUserContentProps> = ({ lists }) => {
    return (
        <section>
            <SectionHeader title="Lists" />
            {lists.length === 0 ? (
                <div className="centeredContainer">
                    <p className={styles.noLists}>This user has not created any lists yet.</p>
                </div>
            ) : (
                lists.map((list) => <div key={list.id}>{list.name}</div>)
            )}
        </section>
    );
};

export default ListsUserContent;
