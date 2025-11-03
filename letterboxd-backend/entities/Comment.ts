import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Movie } from './Movie';
import { User } from './User';

@Entity("comments")
export class Comment {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "content", length: 255 })
    content: string;

    @Column("datetime", { name: "created_at" })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;

    @ManyToOne(() => Movie, (movie) => movie.comments)
    movie: Movie;
}