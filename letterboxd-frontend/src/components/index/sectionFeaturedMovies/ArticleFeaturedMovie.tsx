import styles from './articleFeaturedMovie.module.css';

export interface ArticleFeaturedMovieProps {
    src: string;
    alt: string;
    viewCount: number;
    likeCount: number;
}

function ArticleFeaturedMovie({ src, alt, viewCount, likeCount }: ArticleFeaturedMovieProps) {

    return (
        <article className={styles.articleFeaturedMovie}>
            <img src={src} alt={alt} />
            <section className={styles.sectionFeaturedMovieStats}>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="green" viewBox="0 0 24 24">
                        <path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5
           5 2.239 5 5-2.239 5-5 5zm0-8c-1.654 0-3 1.346-3 3s1.346 3 3 3
           3-1.346 3-3-1.346-3-3-3z"/>
                    </svg>
                    <span>{
                        viewCount > 1000 ? (viewCount / 1000).toFixed(1) + 'K' : viewCount
                    }</span>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="orange" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
           2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
           C13.09 3.81 14.76 3 16.5 3
           19.58 3 22 5.42 22 8.5
           c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span>{
                        likeCount > 1000 ? (likeCount / 1000).toFixed(1) + 'K' : likeCount
                    }</span>
                </div>
            </section>
        </article>
    );
}

export default ArticleFeaturedMovie;