import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './Review';
import { User } from './User';

@Entity('review_likes')
export class ReviewLike {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Review, (review) => review.likes, { onDelete: 'CASCADE' })
    review: Review;

    @ManyToOne(() => User, (user) => user.reviewLikes)
    user: User;
}
