import styles from './sectionJustReviewed.module.css';
import SectionPopularLists from './SectionPopularLists';
import SectionPopularReviews from './SectionPopularReviews';

function SectionJustReviewed() {

    const movies = [
        {
            "name": "Before Sunrise (1995)",
            "imageUrl": "https://a.ltrbxd.com/resized/film-poster/5/1/9/7/4/51974-before-sunrise-0-70-0-105-crop.jpg?v=006e8fedea"
        },
        {
            "name": "Fight Club (1999)",
            "imageUrl": "https://a.ltrbxd.com/resized/film-poster/5/1/5/6/8/51568-fight-club-0-70-0-105-crop.jpg?v=768b32dfa4"
        },
        {
            "name": "Gitling (2023)",
            "imageUrl": "https://a.ltrbxd.com/resized/film-poster/1/0/3/4/4/0/0/1034400-hyphen-2023-1-0-70-0-105-crop.jpg?v=76216f91e1"
        },
        {
            "name": "Evil Under the Sun (1982)",
            "imageUrl": "https://a.ltrbxd.com/resized/alternative-poster/4/9/4/7/5/p/3pXdAR1CQfgvTYenzTeiNbvXxvO-0-70-0-105-crop.jpg?v=11a0ac1b2e"
        },
        {
            "name": "A Life Too Short: The Isabella Nardoni Case (2023)",
            "imageUrl": "https://a.ltrbxd.com/resized/film-poster/1/0/4/5/1/5/2/1045152-a-life-too-short-the-isabella-nardoni-case-0-70-0-105-crop.jpg?v=72adaa70e6"
        },
        {
            "name": "Captain America: The Winter Soldier (2014)",
            "imageUrl": "https://a.ltrbxd.com/resized/sm/upload/he/p6/cc/lg/zt6b493XEL2OQ1bCSKccZ7V0iRY-0-70-0-105-crop.jpg?v=6296209106"
        },
        {
            "name": "The Twilight Saga: New Moon (2009)",
            "imageUrl": "https://a.ltrbxd.com/resized/film-poster/4/0/4/8/0/40480-the-twilight-saga-new-moon-0-70-0-105-crop.jpg?v=ba5ab4ba1e"
        },
        {
            "name": "One Battle After Another (2025)",
            "imageUrl": "https://a.ltrbxd.com/resized/film-poster/9/5/1/2/7/7/951277-one-battle-after-another-0-70-0-105-crop.jpg?v=d27c4cc662"
        },
        {
            "name": "The Poet (2025)",
            "imageUrl": "https://a.ltrbxd.com/resized/film-poster/9/0/8/3/3/4/908334-the-poet-2025-0-70-0-105-crop.jpg?v=399c7794c8"
        },
        {
            "name": "Call Me by Your Name (2017)",
            "imageUrl": "https://a.ltrbxd.com/resized/sm/upload/g9/9t/cc/7u/tcNniniS4rfqrLH0oORikJfnIwY-0-70-0-105-crop.jpg?v=f0c073f2b4"
        },
        {
            "name": "Bon Appétit, Your Majesty (2025)",
            "imageUrl": "https://a.ltrbxd.com/resized/film-poster/1/4/1/6/4/5/5/1416455-bon-appetit-your-majesty-0-70-0-105-crop.jpg?v=75249e1665"
        }
    ]

    return (
        <section>
            <h4 id={styles.h4JustReviewed} className='sectionHeader underlinedHeader'>
                JUST REVIEWED...
                <span>
                    2,944,858,769 films watched
                </span>
            </h4>

            <ul id={styles.listJustReviewed}>
                {movies.map((movie, index) => (
                    <li key={index} className={styles.listItemReviewedMovie}>
                        <div className={styles.listItemReviewedMovieCaption}>{movie.name}</div>
                        <img src={movie.imageUrl} alt={movie.name} />
                    </li>
                ))}
            </ul>


            <p id={styles.pWriteShare}>
                Write and share reviews. Compile your own lists. Share your life in film.
            </p>
            <p id={styles.pBelow}>
                Below are some popular reviews and lists from this week.
                <a href=""> Sign up </a>
                to create your own.
            </p>

            <section id={styles.sectionPopularReviewsAndLists}>
                <SectionPopularReviews />
                <SectionPopularLists />
            </section>
        </section>

    );
}

export default SectionJustReviewed;