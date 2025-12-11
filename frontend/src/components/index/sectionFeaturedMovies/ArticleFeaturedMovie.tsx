import Eye from '../../shared/icons/EyeIcon';
import Heart from '../../shared/icons/HeartIcon';
import ArticleMovie from '../../shared/movieCard/MovieCard';
import styles from './articleFeaturedMovie.module.css';

export interface ArticleFeaturedMovieProps {
    title: string;
    src: string;
    alt: string;
    viewCount: number;
    likeCount: number;
}

function ArticleFeaturedMovie({ title, src, alt, viewCount, likeCount }: ArticleFeaturedMovieProps) {
    const overlay = (
        <section className={styles.overlay}>
            <div>
                <Eye size={28} color="var(--green)" />
                <span>{viewCount}</span>
            </div>
            <div>
                <Heart size={28} color="var(--orange)" />
                <span>{likeCount > 1000 ? (likeCount / 1000).toFixed(1) + 'K' : likeCount}</span>
            </div>
        </section>
    );

    return <ArticleMovie title={title} src={src} alt={alt} overlay={overlay} />;
}

export default ArticleFeaturedMovie;
