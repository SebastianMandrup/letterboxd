import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
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

    @JoinTable()
    @ManyToMany(() => Movie, (movie) => movie.lists)
    movies: Movie[];
}