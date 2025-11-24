import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique
} from "typeorm";
import { Movie } from './Movie.ts';
import { ReviewLike } from './ReviewLike.ts';
import { User } from './User.ts';

import type { Movie as MovieType } from "./Movie.ts";  // type-only
import type { User as UserType } from "./User.ts";  // type-only



@Entity("reviews")
@Unique(["author", "movie"])
export class Review {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("text", { name: "review" })
    review: string;

    @Column("float", { name: "rating" })
    rating: number;

    @Column("timestamp", { name: "createdAt", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column("timestamp", { name: "updatedAt", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @Column("timestamp", { name: "deletedAt", nullable: true })
    deletedAt: Date | null;

    @ManyToOne(() => Movie, (movie) => movie.reviews)
    movie: MovieType;

    @ManyToOne(() => User, (user) => user.reviews)
    author: UserType;

    @OneToMany(() => ReviewLike, (reviewLike) => reviewLike.review)
    likes: ReviewLike[];
}