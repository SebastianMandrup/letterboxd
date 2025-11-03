import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Comment } from './Comment';
import { List } from './List';
import { Review } from './Review';


@Entity("users")
export class User {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "name", length: 255 })
    name: string;

    @Column("varchar", { name: "password", length: 255 })
    password: string;

    @OneToMany(() => Review, (review) => review.author)
    reviews: Review[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => List, (list) => list.user)
    lists: List[];

}