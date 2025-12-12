import { useAuth } from '../../../hooks/auth/useAuth';
import SocialMediaIcons from '../../shared/icons/SocialMediaIcons';
import styles from './sectionGetStarted.module.css';

const SectionGetStarted = () => {
    const { user } = useAuth();

    return (
        <section className={styles.sectionGetStarted}>
            <h2 className={styles.header}>Track films you&apos;ve watched.</h2>
            <h2 className={styles.header}>Save those you want to see.</h2>
            <h2 className={styles.header}>Tell your friends what&apos;s good.</h2>
            {!user && <button className={styles.button}>Get started - it&apos;s free!</button>}
            <p className={styles.subtext}>
                The social network for film lovers . Also avaiable on
                <SocialMediaIcons size={28} />
            </p>
        </section>
    );
};

export default SectionGetStarted;
