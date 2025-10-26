import styles from './recentStories.module.css';

function RecentStories() {

    // imgUrl (movie screenshot), authorAvatarUrl, authorName, storyTitle, storyContentSnippet
    // const recentStories = [];


    return (
        <section>
            <header className="sectionHeader underlinedHeader">
                <h6 className='clickable'>
                    RECENT STORIES
                </h6>
                <span className='clickable'>
                    MORE
                </span>
            </header>

            <div className={styles.divRecentStories}>

            </div>

        </section >
    );
}

export default RecentStories;