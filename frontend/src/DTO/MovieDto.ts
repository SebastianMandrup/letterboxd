import type CastMemberDto from './CastMemberDto';
import type ListDto from './ListDto';
import type ReviewDto from './ReviewDto';

export default interface MovieDto {
    id: number;
    slug: string;
    title: string;
    originalTitle?: string | null;
    adult: boolean;
    genreIds?: number[] | null;
    overview?: string | null;
    popularity?: number | null;
    posterPath?: string | null;
    backdropPath?: string | null;
    releaseDate?: string | Date;
    voteAverage?: number | null;
    voteCount?: number | null;
    likeCount?: number | null;
    viewCount?: number | null;
    isViewed?: boolean;
    status?: string | null;
    tagline?: string | null;
    budget?: number | null;
    revenue?: number | null;
    runtime?: number | null;
    imdbId?: string | null;

    reviews?: ReviewDto[];
    lists?: ListDto[];

    castMembers?: CastMemberDto[];

    genres: {
        id: number;
        name: string;
    }[];

    languages: {
        id: number;
        name: string;
        iso6391: string;
    }[];

    productionCountries: {
        id: number;
        name: string;
        iso31661: string;
    }[];

    productionCompanies: {
        id: number;
        name: string;
        logoPath?: string | null;
        originCountry: string;
    }[];

    videos: {
        id: string;
        key: string;
        name: string;
        site: string;
        type: string;
    }[];
}
