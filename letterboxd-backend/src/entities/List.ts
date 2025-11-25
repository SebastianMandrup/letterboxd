import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Comment } from './Comment';
import { ListLike } from './ListLike';
import { Movie } from './Movie';
import { User } from './User';

@Entity("lists")
export class List {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "name", length: 255 })
    name: string;

    @Column("datetime", { name: "created_at", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.lists)
    user: User;

    @JoinTable({
        name: "lists_movies_movies",
        joinColumn: {
            name: "listsId",           // left column (your list ID column)
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "moviesId",          // right column (movie ID column)
            referencedColumnName: "id"
        }
    })
    @ManyToMany(() => Movie, (movie) => movie.lists)
    movies: Movie[];

    @OneToMany(() => Comment, (comment) => comment.list)
    comments: Comment[];

    @OneToMany(() => ListLike, (listLike) => listLike.list)
    likes: ListLike[];
}