import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Comment } from './Comment.ts';
import { ListLike } from './ListLike.ts';
import { Movie } from './Movie.ts';
import { User } from './User.ts';

 import type { Movie as MovieType } from "./Movie.ts";  // type-only
import type { User as UserType } from "./User.ts";  // type-only


@Entity("lists")
export class List {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "name", length: 255 })
    name: string;

    @Column("datetime", { name: "created_at", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.lists)
    user: UserType;

    @JoinTable()
    @ManyToMany(() => Movie, (movie) => movie.lists)
    movies: MovieType[];

    @OneToMany(() => Comment, (comment) => comment.list)
    comments: Comment[];

    @OneToMany(() => ListLike, (listLike) => listLike.list)
    likes: ListLike[];
}