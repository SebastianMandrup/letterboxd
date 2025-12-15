import Eye from '../../shared/icons/EyeIcon';
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
                <span>
                    {viewCount} {likeCount ? likeCount : ''}
                </span>
            </div>
        </section>
    );

    return <ArticleMovie title={title} src={src} alt={alt} overlay={overlay} />;
}

export default ArticleFeaturedMovie;
