import type { FunctionComponent } from 'react';
import styles from './userDataItem.module.css';

interface UserDataProps {
    value: number;
    label: 'movies' | 'lists' | 'reviews';
    setContent: (content: 'default' | 'movies' | 'lists' | 'reviews') => void;
}

const UserDataItem: FunctionComponent<UserDataProps> = ({ value, label, setContent }) => {
    return (
        <button
            className={styles.userDataItem}
            onClick={() => {
                setContent(label);
            }}
        >
            <h2>{value}</h2>
            <p>{label}</p>
        </button>
    );
};

export default UserDataItem;
