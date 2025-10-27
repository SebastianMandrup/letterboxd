import SectionHeader from '../shared/SectionHeader';
import styles from './popularFilms.module.css';

const PopularFilms = () => {
    return (
        <section className={styles.sectionPopularFilms}>
            <SectionHeader title="Popular Films" link="/films/popular" />
            <img className={styles.imgAd} src="https://a.ltrbxd.com/sm/upload/lz/cd/q9/26/pro-950.png?k=c065ade008" alt="AD" />
        </section>
    );
}

export default PopularFilms;