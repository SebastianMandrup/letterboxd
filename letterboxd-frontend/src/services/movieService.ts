import ApiClient from './apiClient';


export interface Review {
    id: number;
    review: string;
    rating: number;
    author: {
        name: string;
    };
}

export interface List {
    id: number;
    name: string;
    author: string;
    description?: string | null;
}

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

    reviews: Review[];
    lists: List[];
}

export default new ApiClient<Movie>('/movies');
