import {
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Movie } from './Movie';
import { User } from './User';

@Entity("movie_likes")
export class MovieLike {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("datetime", { name: "created_at" })
    createdAt: Date;

    @ManyToOne(() => Movie, (movie) => movie.likes)
    movie: Movie;

    @ManyToOne(() => User, (user) => user.movieLikes)
    user: User;
}