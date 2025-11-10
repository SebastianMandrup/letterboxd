import ApiClient from './apiClient';

export interface Movie {
    id: number;
    title: string;
    originalTitle?: string | null;
    adult: boolean;
    genreIds?: number[] | null;
    overview?: string | null;
    popularity?: number | null;
    posterUrl?: string | null;
    backdropUrl?: string | null;
    releaseDate?: string | Date;
    voteAverage?: number | null;
    voteCount?: number | null;
}

export default new ApiClient<Movie>('/movies');
