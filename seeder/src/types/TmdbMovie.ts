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
    videos?: { id: string; key: string; name: string; site: string; type: string }[];
    credits?: {
        cast: {
            id: number;
            gender: number;
            profile_path?: string;
            name: string;
            character?: string;
            known_for_department: string;
            department: string;
            job?: string;
        }[];
    };
}
