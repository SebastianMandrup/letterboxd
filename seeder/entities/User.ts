import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Comment } from './Comment.ts';
import { CommentLike } from './CommentLike.ts';
import { List } from './List.ts';
import { ListLike } from './ListLike.ts';
import { MovieLike } from './MovieLike.ts';
import { Review } from './Review.ts';
import { ReviewLike } from './ReviewLike.ts';
import { View } from './View.ts';


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

    @OneToMany(() => View, (view) => view.user)
    views: View[];

    @OneToMany(() => CommentLike, (commentLike) => commentLike.user)
    commentLikes: CommentLike[];

    @OneToMany(() => ReviewLike, (reviewLike) => reviewLike.user)
    reviewLikes: ReviewLike[];

    @OneToMany(() => MovieLike, (movieLike) => movieLike.user)
    movieLikes: MovieLike[];

    @OneToMany(() => ListLike, (listLike) => listLike.user)
    listLikes: ListLike[];

}