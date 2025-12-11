import type { FunctionComponent } from 'react';
import type ListDto from '../../../DTO/ListDto';
import SectionHeader from '../../../components/shared/sectionHeader/SectionHeader';
import styles from './listsUserContent.module.css';
import ListCardWithDescription from '../../../components/shared/listCard/ListCardWithDescription';

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
                lists.map((list) => <ListCardWithDescription key={list.id} list={list} />)
            )}
        </section>
    );
};

export default ListsUserContent;
