import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Genre } from './Genre';
import { List } from './List';
import { MovieLike } from './MovieLike';
import { Review } from './Review';
import { View } from './View';
import { ProductionCompany } from './ProductionCompany';
import { Country } from './Country';
import { Language } from './Language';
import { CrewMember } from './CrewMember';
import { CastMember } from './CastMember';
import { Video } from './Video';
import type { Video as VideoType } from './Video';

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
    reviews: Review[];

    @OneToMany(() => View, (view) => view.movie)
    views: View[];

    @OneToMany(() => MovieLike, (like) => like.movie)
    likes: MovieLike[];

    @OneToMany(() => Video, (video) => video.movie)
    videos: VideoType[];

    @OneToMany(() => CastMember, (castMember) => castMember.movie)
    castMembers: CastMember[];

    @OneToMany(() => CrewMember, (crewMember) => crewMember.movie)
    crewMembers: CrewMember[];

    @ManyToMany(() => Genre, (genre) => genre.movies)
    @JoinTable()
    genres: Genre[];

    @ManyToMany(() => Language, (language) => language.movies)
    @JoinTable()
    languages: Language[];

    @ManyToMany(() => Country, (country) => country.movies)
    @JoinTable()
    productionCountries: Country[];

    @ManyToMany(() => ProductionCompany, (company) => company.movies)
    @JoinTable()
    productionCompanies: ProductionCompany[];

    @ManyToMany(() => List, (list) => list.movies)
    lists: List[];

    isViewed?: boolean;
}
