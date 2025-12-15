import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// runtime imports
import { Genre } from './Genre.ts';
import { List } from './List.ts';
import { MovieLike } from './MovieLike.ts';
import { Review } from './Review.ts';
import { View } from './View.ts';
import { Video } from './Video.ts';
import { Language } from './Language.ts';
import { Country } from './Country.ts';
import { ProductionCompany } from './ProductionCompany.ts';
import { CastMember } from './CastMember.ts';
import { CrewMember } from './CrewMember.ts';

// type-only imports for TypeScript type safety
import type { Genre as GenreType } from './Genre.ts';
import type { List as ListType } from './List.ts';
import type { MovieLike as MovieLikeType } from './MovieLike.ts';
import type { Review as ReviewType } from './Review.ts';
import type { View as ViewType } from './View.ts';
import type { Video as VideoType } from './Video.ts';
import type { Language as LanguageType } from './Language.ts';
import type { Country as CountryType } from './Country.ts';
import type { ProductionCompany as ProductionCompanyType } from './ProductionCompany.ts';
import type { CastMember as CastMemberType } from './CastMember.ts';
import type { CrewMember as CrewMemberType } from './CrewMember.ts';

@Entity('movies')
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column('varchar', { length: 255 })
    slug: string;

    @Index()
    @Column('varchar', { length: 255 })
    title: string;

    @Column('varchar', { name: 'original_title', length: 255, nullable: true })
    originalTitle?: string;

    @Column('boolean', { default: false })
    adult: boolean;

    @Column('text', { nullable: true })
    overview?: string;

    @Column('varchar', { name: 'poster_path', nullable: true })
    posterPath?: string;

    @Column('varchar', { name: 'backdrop_path', nullable: true })
    backdropPath?: string;

    @Column('date', { name: 'release_date', nullable: true })
    releaseDate?: Date;

    @Column('float', { name: 'vote_average', nullable: true })
    voteAverage?: number;

    @Column('int', { name: 'vote_count', nullable: true })
    voteCount?: number;

    @Column('float', { nullable: true })
    popularity?: number;

    @Column('bigint', { nullable: true })
    budget?: number;

    @Column('bigint', { nullable: true })
    revenue?: number;

    @Column('int', { nullable: true })
    runtime?: number;

    @Column('varchar', { length: 255, nullable: true })
    tagline?: string;

    @Column('varchar', { name: 'homepage', length: 500, nullable: true })
    homepage?: string;

    @Column('varchar', { name: 'imdb_id', length: 20, nullable: true })
    imdbId?: string;

    @Column('varchar', { name: 'status', length: 50, nullable: true })
    status?: string;

    // Relationships
    @OneToMany(() => Review, (review) => review.movie)
    reviews: ReviewType[];

    @OneToMany(() => View, (view) => view.movie)
    views: ViewType[];

    @OneToMany(() => MovieLike, (like) => like.movie)
    likes: MovieLikeType[];

    @OneToMany(() => Video, (video) => video.movie)
    videos: VideoType[];

    @OneToMany(() => CastMember, (castMember) => castMember.movie)
    castMembers: CastMemberType[];

    @OneToMany(() => CrewMember, (crewMember) => crewMember.movie)
    crewMembers: CrewMemberType[];

    @ManyToMany(() => Genre, (genre) => genre.movies)
    @JoinTable({
        name: 'movie_genre', // CORRECT TABLE NAME
        joinColumn: {
            name: 'movieId', // Could be 'movieId', 'movie_id', 'moviesId'
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'genreId', // Could be 'genreId', 'genre_id', 'genresId'
            referencedColumnName: 'id',
        },
    })
    genres: GenreType[];

    @ManyToMany(() => Language, (language) => language.movies)
    @JoinTable()
    languages: LanguageType[];

    @ManyToMany(() => Country, (country) => country.movies)
    @JoinTable()
    productionCountries: CountryType[];

    @ManyToMany(() => ProductionCompany, (company) => company.movies)
    @JoinTable()
    productionCompanies: ProductionCompanyType[];

    @ManyToMany(() => List, (list) => list.movies)
    lists: ListType[];
}
