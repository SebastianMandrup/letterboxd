import type { FunctionComponent } from 'react';
import styles from './userDataItem.module.css';

interface UserDataProps {
    value: number;
    label: string;
}

const UserDataItem: FunctionComponent<UserDataProps> = ({ value, label }) => {
    const uppercasedLabel = label.toUpperCase();
    const formattedLabel = value > 1 ? uppercasedLabel + 'S' : uppercasedLabel + '';

    return (
        <article className={styles.userDataItem}>
            <h2>{value}</h2>
            <p>{formattedLabel}</p>
        </article>
    );
};

export default UserDataItem;
