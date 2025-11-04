import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { Review } from './Review';
import { User } from './User';

@Entity("review-likes")
export class ReviewLike {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("datetime", { name: "created_at" })
    createdAt: Date;

    @ManyToOne(() => Review, (review) => review.likes)
    review: Review;

    @ManyToOne(() => User, (user) => user.reviewLikes)
    user: User;
}