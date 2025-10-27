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

    @Column("varchar", { name: "posterUrl" })
    posterUrl?: string;

    @Column("varchar", { name: "releaseDate" })
    releaseDate?: Date;

    @OneToMany(() => Review, (review) => review.movie)
    reviews: Review[];

    @OneToMany(() => View, (view) => view.movie)
    views: View[];


}
