import {
    Column,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Genre } from './Genre';
import { List } from './List';
import { MovieLike } from './MovieLike';
import { Review } from './Review';
import { View } from './View';

@Entity("movies")
export class Movie {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Index()
    @Column("varchar", { name: "title", length: 255 })
    title: string;

    @Column("varchar", { name: "originalTitle", length: 255, nullable: true })
    originalTitle: string;

    @Column("boolean", { name: "adult", default: false })
    adult: boolean;

    @Column("text", { name: "overview", nullable: true })
    overview: string;

    @Column("varchar", { name: "posterUrl", nullable: true })
    posterUrl?: string;

    @Column("varchar", { name: "backdropUrl", nullable: true })
    backdropUrl?: string;

    @Column("date", { name: "releaseDate" })
    releaseDate?: Date;

    @Column("float", { name: "voteAverage", nullable: true })
    voteAverage?: number;

    @Column("int", { name: "voteCount", nullable: true })
    voteCount?: number;

    @OneToMany(() => Review, (review) => review.movie)
    reviews: Review[];

    @OneToMany(() => View, (view) => view.movie)
    views: View[];

    @OneToMany(() => MovieLike, (MovieLike) => MovieLike.movie)
    likes: MovieLike[];

    @JoinTable()
    @ManyToMany(() => Genre, (genre) => genre.movies)
    genres: Genre[];

    @ManyToMany(() => List, (list) => list.movies)
    lists: List[];

}
