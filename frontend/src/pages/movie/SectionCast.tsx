import { useEffect, useState, type FunctionComponent } from 'react';
import type CastMemberDto from '../../DTO/CastMemberDto';
import styles from './sectionCast.module.css';
import SectionHeader from '../shared/sectionHeader/SectionHeader';

interface SectionCastProps {
    castMembers: CastMemberDto[] | undefined;
}

const SectionCast: FunctionComponent<SectionCastProps> = ({ castMembers }) => {
    const [displayedCastMembers, setDisplayedCastMembers] = useState<CastMemberDto[] | []>(castMembers?.slice(0, 5) || []);
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        if (isCollapsed) {
            setDisplayedCastMembers(castMembers?.slice(0, 5) || []);
        } else {
            setDisplayedCastMembers(castMembers || []);
        }
    }, [isCollapsed, castMembers]);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <section className={styles.sectionCast}>
            <SectionHeader title="Cast" />
            {castMembers && castMembers.length > 0 ? (
                <>
                    <ul className={styles.castMemberList}>
                        {displayedCastMembers.map((castMember) => (
                            <li className={styles.castMemberListItem} key={castMember.id}>
                                <p className={styles.actorName}>{castMember.name}</p>
                                <div className={styles.divCharacterNameSeparator} />
                                <p className={styles.characterName}>{castMember.character}</p>
                            </li>
                        ))}
                    </ul>
                    <button onClick={toggleCollapse} className={styles.toggleButton}>
                        {isCollapsed ? 'show more' : 'show less'}
                    </button>
                </>
            ) : (
                <p className={styles.noCastInfo}>No cast information available.</p>
            )}
        </section>
    );
};

export default SectionCast;
