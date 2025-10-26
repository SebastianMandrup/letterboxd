import styles from './sectionPopularReviewers.module.css';

function SectionPopularReviewers() {

    const popularReviewers = [
        {
            srcAvatar: 'https://i.pravatar.cc/150?u=MovieBuff123',
            name: 'MovieBuff123',
            numberOfFilms: 250,
            numberOfReviews: 45
        },
        {
            srcAvatar: 'https://i.pravatar.cc/150?u=CinephileGal',
            name: 'CinephileGal',
            numberOfFilms: 300,
            numberOfReviews: 60
        },
        {
            srcAvatar: 'https://i.pravatar.cc/150?u=FilmFanatic',
            name: 'FilmFanatic',
            numberOfFilms: 150,
            numberOfReviews: 30
        }
    ];


    return (
        <section>
            <header className={styles.headerPopularReviewers + " sectionHeader underlinedHeader"}>
                <h6 className='clickable'>
                    POPULAR REVIEWERS
                </h6>
                <span className='clickable'>
                    MORE
                </span>
            </header>
            {popularReviewers.map((reviewer, index) => {
                return (
                    <article key={index} className={styles.articlePopularReviewer}>
                        <img className={styles.imgReviewerAvatar} src={reviewer.srcAvatar} alt="Reviewer Avatar" />
                        <section>
                            <p className={styles.pReviewerName}>
                                {reviewer.name}
                            </p>
                            <p className={styles.pReviewerStats}>
                                {reviewer.numberOfFilms} films, {reviewer.numberOfReviews} reviews
                            </p>
                        </section>

                    </article>
                )
            })}
        </section>
    );
}

export default SectionPopularReviewers;