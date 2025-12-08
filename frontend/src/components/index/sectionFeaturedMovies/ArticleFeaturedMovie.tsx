import Eye from '../../shared/icons/Eye';
import Heart from '../../shared/icons/Heart';
import ArticleMovie from '../../shared/movieCard/MovieCard';

export interface ArticleFeaturedMovieProps {
    title: string;
    src: string;
    alt: string;
    viewCount: number;
    likeCount: number;
}

function ArticleFeaturedMovie({ title, src, alt, viewCount, likeCount }: ArticleFeaturedMovieProps) {
    const overlay = (
        <section>
            <div>
                <Eye size={34} color="var(--green)" />
                <span>{viewCount}</span>
            </div>
            <div>
                <Heart size={34} color="var(--orange)" />
                <span>{likeCount > 1000 ? (likeCount / 1000).toFixed(1) + 'K' : likeCount}</span>
            </div>
        </section>
    );

    return <ArticleMovie title={title} src={src} alt={alt} overlay={overlay} />;
}

export default ArticleFeaturedMovie;
