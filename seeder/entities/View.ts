import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique
} from "typeorm";
import { Movie } from './Movie.ts';
import { User } from './User.ts';

import type { Movie as MovieType } from "./Movie.ts";  // type-only
import type { User as UserType } from "./User.ts";  // type-only


@Entity("views")
@Unique(["user", "movie"])
export class View {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("timestamp", { name: "viewedAt", default: () => "CURRENT_TIMESTAMP" })
    viewedAt: Date;

    @ManyToOne(() => Movie, (movie) => movie.views)
    movie: MovieType;

    @ManyToOne(() => User, (user) => user.views)
    user: UserType;
}