import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Review } from './Review';
import { View } from './View';

@Entity("movies")
export class Movie {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "title", length: 255 })
    title: string;

    @Column("varchar", { name: "originalTitle", length: 255, nullable: true })
    originalTitle: string;

    @Column("boolean", { name: "adult", default: false })
    adult: boolean;

    @Column("simple-array", { name: "genreIds", nullable: true })
    genreIds: number[];

    @Column("text", { name: "overview", nullable: true })
    overview?: string;

    @Column("float", { name: "popularity", nullable: true })
    popularity?: number;

    @Column("varchar", { name: "posterUrl", nullable: true })
    posterUrl?: string;

    @Column("varchar", { name: "backdropUrl", nullable: true })
    backdropUrl?: string;

    @Column("varchar", { name: "releaseDate" })
    releaseDate?: Date;

    @Column("float", { name: "voteAverage", nullable: true })
    voteAverage?: number;

    @Column("int", { name: "voteCount", nullable: true })
    voteCount?: number;

    @OneToMany(() => Review, (review) => review.movie)
    reviews: Review[];

    @OneToMany(() => View, (view) => view.movie)
    views: View[];


}
