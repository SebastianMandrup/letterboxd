import styles from './sectionPopularReviews.module.css';

function SectionPopularReviews() {

    const popularReviews = [
        {
            "movie": "One Battle After Another",
            "releaseYear": 2025,
            "authorAvatarUrl": "https://a.ltrbxd.com/resized/avatar/upload/3/6/8/9/5/9/8/shard/avtr-0-48-0-48-crop.jpg?v=2c28f8007c",
            "authorName": "ConnorEatsPants",
            "score": 5,
            "reviewContent": "if the president sees this he will either ban movies or kill himself",
            "numberOfLikes": 9879,
            "moviePosterUrl": "https://a.ltrbxd.com/resized/film-poster/9/5/1/2/7/7/951277-one-battle-after-another-0-70-0-105-crop.jpg?v=d27c4cc662"
        },
        {
            "movie": "The Long Walk",
            "releaseYear": 2025,
            "authorAvatarUrl": "https://a.ltrbxd.com/resized/avatar/upload/6/7/5/4/8/6/6/shard/avtr-0-48-0-48-crop.jpg?v=d0660e5b16",
            "authorName": "justinwuah",
            "score": 4,
            "reviewContent": "we as a society simply have to make sure that mr beast does not ever watch this film",
            "numberOfLikes": 25638,
            "moviePosterUrl": "https://a.ltrbxd.com/resized/alternative-poster/5/3/1/3/1/6/p/9lA2fKch4rG2lL3xy3xjm9KJw1M-0-70-0-105-crop.jpg?v=81ef7d9cef"
        },
        {
            "movie": "HIM",
            "releaseYear": 2025,
            "authorAvatarUrl": "https://a.ltrbxd.com/resized/avatar/upload/4/6/5/7/4/9/9/shard/avtr-0-48-0-48-crop.jpg?v=e4cb6cd188",
            "authorName": "michellekuhn",
            "score": 4,
            "reviewContent": "the people who disliked this probably haven't experienced the epic highs and lows of high school football",
            "numberOfLikes": 6387,
            "moviePosterUrl": "https://a.ltrbxd.com/resized/film-poster/8/8/7/9/5/6/887956-him-2025-0-70-0-105-crop.jpg?v=c0d69b5b2d"
        },
        {
            "movie": "One Battle After Another",
            "releaseYear": 2025,
            "authorAvatarUrl": "https://a.ltrbxd.com/resized/avatar/upload/5/6/0/0/6/0/9/shard/avtr-0-48-0-48-crop.jpg?v=298c9729e8",
            "authorName": "ManCarrying",
            "score": 5,
            "reviewContent": "PTA making modern fascists and white-nationalists look like the dumbest pieces of shit for 2hrs 45mins. Movie of all time.",
            "numberOfLikes": 4287,
            "moviePosterUrl": "https://a.ltrbxd.com/resized/film-poster/9/5/1/2/7/7/951277-one-battle-after-another-0-70-0-105-crop.jpg?v=d27c4cc662"
        },
        {
            "movie": "One Battle After Another",
            "releaseYear": 2025,
            "authorAvatarUrl": "https://a.ltrbxd.com/resized/avatar/upload/9/7/8/7/9/0/1/shard/avtr-0-48-0-48-crop.jpg?v=493d5a438c",
            "authorName": "eddyburback",
            "score": 5,
            "reviewContent": "Sean Penn delivers one of the weirdest walks of all time. An oscar worthy weird guy walk.",
            "numberOfLikes": 4015,
            "moviePosterUrl": "https://a.ltrbxd.com/resized/film-poster/9/5/1/2/7/7/951277-one-battle-after-another-0-70-0-105-crop.jpg?v=d27c4cc662"
        }
    ];


    return (
        <section>
            <header id={styles.headerPopularReviews} className='sectionHeader underlinedHeader'>
                <h5 className='clickable'>
                    POPULAR REVIEWS THIS WEEK
                </h5>
                <span className='clickable'>
                    MORE
                </span>
            </header>

            {
                popularReviews.map((review) => {
                    return (
                        <article className={styles.articlePopularReview}>
                            <img className={styles.imgPopularReviewMoviePoster} src={review.moviePosterUrl} alt={`poster of ${review.movie}`} />
                            <section className={styles.sectionPopularReviewContent}>
                                <header>
                                    <p>
                                        {review.movie}
                                    </p>
                                    <span>
                                        {review.releaseYear}
                                    </span>
                                </header>
                                <section className={styles.sectionPopularReviewAuthorAndScore}>
                                    <img src={review.authorAvatarUrl} alt={`${review.authorName}'s avatar`} />
                                    <p>{review.authorName}</p>
                                    <div className={styles.divStars}>
                                        {[...Array(review.score)].map((_, starIndex) => (
                                            <span key={starIndex}>★</span>
                                        ))}
                                    </div>
                                </section>
                                <p className={styles.pReviewContent}>
                                    {review.reviewContent}
                                </p>
                                <p className={styles.pNumberOfLikes}>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" viewBox="0 0 15 12">
                                            <path fill="currentColor" fill-rule="evenodd" d="M11.27 0C9.36 0 7.5 2.09 7.5 2.09S5.64 0 3.73 0 0 .87 0 3.44c0 1.83 1.88 3.43 1.88 3.43L7.5 12l5.62-5.13S15 5.27 15 3.44C15 .87 13.18 0 11.27 0" />
                                        </svg>
                                    </span>
                                    {review.numberOfLikes} likes
                                </p>
                            </section>
                        </article>
                    )
                })
            }

        </section >
    );
}

export default SectionPopularReviews;