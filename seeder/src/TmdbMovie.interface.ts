export default interface TmdbMovie {
    id: number;
    title: string;
    original_title: string;
    genre_ids: number[];
    popularity: number;
    overview: string;
    release_date: string;
    poster_path: string | null;
    adult: boolean;
    backdrop_path: string | null;
    original_language: string;
    vote_count: number;
    vote_average: number;
}