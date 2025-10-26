import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Movie } from './Movie';
import { User } from './User';


@Entity("views", { schema: "letterboxd" })
export class View {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @ManyToOne(() => Movie, (movie) => movie)
    movie: Movie;

    @ManyToOne(() => User, (user) => user)
    user: User;
}