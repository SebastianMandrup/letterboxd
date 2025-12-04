import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from './Review';
import { User } from './User';

@Entity('review_likes')
export class ReviewLike {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Review, (review) => review.likes)
  review: Review;

  @ManyToOne(() => User, (user) => user.reviewLikes)
  user: User;
}
