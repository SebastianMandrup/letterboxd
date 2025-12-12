import type { FunctionComponent } from 'react';
import SectionCast from './SectionCast';
import type MovieDto from '../../DTO/MovieDto';
import { getMediumPoster } from '../../util/getMediumPoster';
import MovieCard from '../shared/movieCard/MovieCard';
import styles from './movieAside.module.css';

interface MovieAsideProps {
    movie: MovieDto;
}

const MovieAside: FunctionComponent<MovieAsideProps> = ({ movie }) => {
    const officialTrailer = movie.videos?.find((video) => video.type === 'Trailer' && video.name.toLowerCase().includes('official'));

    return (
        <aside className={styles.sectionAside}>
            <MovieCard title={movie.title} src={getMediumPoster(movie.posterPath)} alt={'poster of ' + movie.title} />
            {officialTrailer && (
                <div className={styles.videoContainer}>
                    <iframe
                        className={styles.trailerIframe}
                        src={`https://www.youtube.com/embed/${officialTrailer.key}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
            <SectionCast castMembers={movie.castMembers} />
        </aside>
    );
};

export default MovieAside;
