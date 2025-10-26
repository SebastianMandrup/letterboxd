import list_1 from '../../../assets/list-1.png';
import list_2 from '../../../assets/list-2.png';
import list_3 from '../../../assets/list-3.png';
import styles from './sectionPopularLists.module.css';
import SectionPopularReviewers from './SectionPopularReviewers';

function SectionPopularLists() {

    const popularLists = [
        {
            imageUrl: list_1,
            title: 'Top 10 Sci-Fi Movies',
            author: 'John Doe',
            itemCount: 10,
            likes: 150,
            comments: 20
        },
        {
            imageUrl: list_2,
            title: 'Best Fantasy Novels',
            author: 'Jane Smith',
            itemCount: 8,
            likes: 200,
            comments: 35
        },
        {
            imageUrl: list_3,
            title: 'Must-Watch Documentaries',
            author: 'Alice Johnson',
            itemCount: 12,
            likes: 180,
            comments: 25
        }
    ]

    return (
        <section id={styles.sectionPopularLists}>
            <header id={styles.headerPopularLists} className='sectionHeader underlinedHeader'>
                <h6 className='clickable'>
                    POPULAR LISTS
                </h6>
                <span className='clickable'>
                    MORE
                </span>
            </header>

            {popularLists.map((list, index) => {
                return (
                    <article key={index} className={styles.articlePopularList}>
                        <img src={list.imageUrl} alt="List Thumbnail" />
                        <p className={styles.listTitle}>
                            {list.title}
                        </p>
                        <p className={styles.listAuthor}>
                            {list.author}
                        </p>
                        <section className={styles.listDetails}>
                            <p>
                                {list.itemCount} films
                            </p>
                            <p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>

                                {list.likes}
                            </p>
                            <p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21 6h-18c-1.1 0-2 .9-2 2v12l4-4h16c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2z" />
                                </svg>

                                {list.comments}
                            </p>
                        </section>
                    </article>

                )
            })}
            <SectionPopularReviewers />
        </section>
    );
}

export default SectionPopularLists;