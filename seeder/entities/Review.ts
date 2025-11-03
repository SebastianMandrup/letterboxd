import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique
} from "typeorm";
import { Movie } from './Movie';
import { User } from './User';


@Entity("reviews")
@Unique(["author", "movie"])
export class Review {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("text", { name: "review" })
    review: string;

    @Column("float", { name: "rating" })
    rating: number;

    @ManyToOne(() => Movie, (movie) => movie.reviews)
    movie: Movie;

    @ManyToOne(() => User, (user) => user.reviews)
    author: User;
}