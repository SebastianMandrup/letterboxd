import '../shared/sectionHeader.css';
import styles from './popularFilms.module.css';

const PopularFilms = () => {
    return (
        <section className={styles.sectionPopularFilms}>
            <header className="sectionHeader">
                POPULAR FILMS THIS WEEK
                <a href="">
                    MORE
                </a>
            </header>
            <img className={styles.imgAd} src="https://a.ltrbxd.com/sm/upload/lz/cd/q9/26/pro-950.png?k=c065ade008" alt="AD" />
        </section>
    );
}

export default PopularFilms;