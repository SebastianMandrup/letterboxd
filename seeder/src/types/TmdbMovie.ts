/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface TmdbMovie {
    id: number;
    title: string;
    original_title: string;
    genre_ids: number[];
    genres?: Array<{
        id: number;
        name: string;
    }>;
    popularity: number;
    overview: string;
    release_date: string;
    poster_path: string | null;
    adult: boolean;
    backdrop_path: string | null;
    original_language: string;
    vote_count: number;
    vote_average: number;
    budget?: number;
    revenue?: number;
    runtime?: number;
    tagline?: string;
    homepage?: string;
    imdb_id?: string;
    status?: string;

    spoken_languages: Array<{
        english_name: string;
        iso_639_1: string;
        name: string;
    }>;

    production_countries: Array<{
        iso_3166_1: string;
        name: string;
    }>;

    production_companies: Array<{
        id: number;
        name: string;
        origin_country?: string[];
    }>;

    credits: {
        cast: Array<{
            id: number;
            name: string;
            character: string;
            order?: number;
            profile_path?: string;
            gender?: number;
        }>;
        crew: Array<{
            id: number;
            name: string;
            job: string;
            department: string;
            profile_path?: string;
            gender?: number;
        }>;
    };

    videos?: Array<{
        iso_639_1: string;
        iso_3166_1: string;
        name: string;
        key: string;
        site: string;
        size: number;
        type: string;
        official: boolean;
        published_at: string;
        id: string;
    }>;

    _castMembers?: any[];
    _crewMembers?: any[];
    _videos?: any[];
}
