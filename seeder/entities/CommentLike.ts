import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Comment } from './Comment';
import { User } from './User';

@Entity("comment-likes")
export class CommentLike {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("datetime", { name: "created_at" })
    createdAt: Date;

    @ManyToOne(() => Comment, (comment) => comment.likes)
    comment: Comment;

    @ManyToOne(() => User, (user) => user.commentLikes)
    user: User;
}