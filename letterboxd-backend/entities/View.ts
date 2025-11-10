import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique
} from "typeorm";
import { Movie } from './Movie';
import { User } from './User';


@Entity("views")
@Unique(["user", "movie"])
export class View {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("timestamp", { name: "viewedAt", default: () => "CURRENT_TIMESTAMP" })
    viewedAt: Date;

    @ManyToOne(() => Movie, (movie) => movie.views)
    movie: Movie;

    @ManyToOne(() => User, (user) => user.views)
    user: User;
}