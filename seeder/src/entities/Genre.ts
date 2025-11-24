import {
    Column,
    Entity,
    Index,
    ManyToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Movie } from './Movie.ts';

@Entity("genres")
export class Genre {

    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Index()
    @Column("varchar", { name: "name", length: 255 })
    name: string;

    @ManyToMany(() => Movie, (movie) => movie.genres)
    movies: Movie[];
}