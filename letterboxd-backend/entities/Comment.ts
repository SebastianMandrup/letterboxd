import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { CommentLike } from './CommentLike';
import { List } from './List';
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

    @ManyToOne(() => List, (list) => list.comments)
    list: List;

    @OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
    likes: CommentLike[];
}