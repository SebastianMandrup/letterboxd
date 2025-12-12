import DiaryIcon from '../../shared/icons/DiaryIcon';
import EditIcon from '../../shared/icons/EditIcon';
import EyeIcon from '../../shared/icons/EyeIcon';
import HeartIcon from '../../shared/icons/HeartIcon';
import ListIcon from '../../shared/icons/ListIcon';
import StarIcon from '../../shared/icons/StarIcon';
import SectionHeader from '../../shared/sectionHeader/SectionHeader';
import ButtonLetterboxLetsYou from './ButtonLetterboxLetsYou';
import styles from './sectionLetterboxLetsYou.module.css';

function SectionLetterboxLetsYou() {
    const size = 24;

    return (
        <section>
            <SectionHeader title="LETTERBOXD LETS YOU..." />
            <div className={styles.divLetterboxLetsYouButtons}>
                <ButtonLetterboxLetsYou
                    svg={<EyeIcon size={size} />}
                    text="Keep track of every movie you've ever watched (or just start from the day you join)."
                />
                <ButtonLetterboxLetsYou svg={<HeartIcon size={size} />} text="Discover new movies and find out what your friends are watching and loving." />
                <ButtonLetterboxLetsYou svg={<EditIcon size={size} />} text="Write reviews and share your opinions with a community of film lovers." />
                <ButtonLetterboxLetsYou svg={<StarIcon size={size} />} text="Rate and review films to build a personal record of your film-watching journey." />
                <ButtonLetterboxLetsYou
                    svg={<DiaryIcon size={size} />}
                    text="Keep a diary of your film watching (and upgrade to pro for comprehensive stats)"
                />
                <ButtonLetterboxLetsYou
                    svg={<ListIcon size={size} />}
                    text="Compile and share lists of films on any topic and keep a watchlist of films to see"
                />
            </div>
        </section>
    );
}

export default SectionLetterboxLetsYou;
