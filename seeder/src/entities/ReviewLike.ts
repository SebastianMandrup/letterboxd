import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './Review.ts';
import { User } from './User.ts';

import type { Review as ReviewType } from './Review.ts'; // type-only
import type { User as UserType } from './User.ts'; // type-only

@Entity('review_likes')
export class ReviewLike {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Review, (review) => review.likes)
    review: ReviewType;

    @ManyToOne(() => User, (user) => user.reviewLikes)
    user: UserType;
}
