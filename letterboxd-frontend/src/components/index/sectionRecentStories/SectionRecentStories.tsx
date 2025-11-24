import SectionHeader from '../../shared/sectionHeader/SectionHeader';
import styles from './sectionRecentStories.module.css';

function SectionRecentStories() {

    // imgUrl (movie screenshot), authorAvatarUrl, authorName, storyTitle, storyContentSnippet
    // const recentStories = [];


    return (
        <section>
            <SectionHeader title="Recent Stories" link='/hq' subtitle='all HQs' />

            <div className={styles.divRecentStories}>

            </div>

        </section >
    );
}

export default SectionRecentStories;