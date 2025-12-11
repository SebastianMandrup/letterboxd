import { useState, type FunctionComponent } from 'react';
import styles from './collapseText.module.css';

interface CollapseTextProps {
    text: string;
    length?: number;
}

const CollapseText: FunctionComponent<CollapseTextProps> = ({ text, length = 200 }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    if (text.length <= length) {
        return <>{text}</>;
    }

    const firstPart = text.slice(0, length);
    const secondPart = text.slice(length);

    return (
        <>
            <p>
                {firstPart}
                {isCollapsed ? '... ' : secondPart}
                {isCollapsed && (
                    <button className={styles.showMore} onClick={toggleCollapse}>
                        more
                    </button>
                )}
            </p>
        </>
    );
};

export default CollapseText;
