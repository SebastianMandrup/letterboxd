import ArticleFeaturedMovie, { type ArticleFeaturedMovieProps } from './ArticleFeaturedMovie';
import styles from './sectionFeaturedMovies.module.css';

const SectionFeaturedMovies = () => {

    const featuredMovies: ArticleFeaturedMovieProps[] = [
        {
            src: "https://a.ltrbxd.com/resized/film-poster/9/5/1/2/7/7/951277-one-battle-after-another-0-150-0-225-crop.jpg?v=d27c4cc662",
            alt: "One Battle After Another (2025)",
            viewCount: 5079,
            likeCount: 2403,
        },
        {
            src: "https://a.ltrbxd.com/resized/film-poster/6/8/0/7/3/9/680739-the-smashing-machine-2025-0-150-0-225-crop.jpg?v=e1c8e23118",
            alt: "The Smashing Machine (2025)",
            viewCount: 3552,
            likeCount: 909,
        },
        {
            src: "https://a.ltrbxd.com/resized/film-poster/5/3/1/3/1/6/531316-the-long-walk-2025-0-150-0-225-crop.jpg?v=9cf0c245aa",
            alt: "The Long Walk (2025)",
            viewCount: 208583,
            likeCount: 75471,
        },
        {
            src: "https://a.ltrbxd.com/resized/film-poster/1/2/5/2/3/4/6/1252346-anemone-2025-0-150-0-225-crop.jpg?v=28f214ad98",
            alt: "Anemone (2025)",
            viewCount: 214,
            likeCount: 83,
        },
        {
            src: "https://a.ltrbxd.com/resized/film-poster/8/0/2/6/1/5/802615-the-history-of-sound-0-150-0-225-crop.jpg?v=5923cf9430",
            alt: "The History of Sound (2025)",
            viewCount: 12421,
            likeCount: 3047,
        },
        {
            src: "https://a.ltrbxd.com/resized/sm/upload/rl/g1/hs/88/plain-0-150-0-225-crop.jpg?v=66214c9197",
            alt: "Plainclothes (2025)",
            viewCount: 7620,
            likeCount: 2842,
        },
    ];


    return (
        <section id={styles.sectionFeaturedMovies}>
            {
                featuredMovies.map((movie, index) => (
                    <ArticleFeaturedMovie
                        key={index}
                        src={movie.src}
                        alt={movie.alt}
                        viewCount={movie.viewCount}
                        likeCount={movie.likeCount}
                    />
                ))
            }

        </section>
    );
}

export default SectionFeaturedMovies;