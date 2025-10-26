import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Movie } from './Movie';
import { User } from './User';


@Entity("reviews", { schema: "letterboxd" })
export class Review {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "review", length: 255 })
    review: string;

    @Column("float", { name: "rating" })
    rating: number;

    @ManyToOne(() => Movie, (movie) => movie.reviews)
    movie: Movie;

    @ManyToOne(() => User, (user) => user.reviews)
    author: User;
}