import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Movie } from './Movie';
import { ReviewLike } from './ReviewLike';
import { User } from './User';

@Entity('reviews')
@Unique(['author', 'movie'])
export class Review {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'review' })
  review: string;

  @Column('float', { name: 'rating' })
  rating: number;

  @Column('timestamp', {
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updatedAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('timestamp', { name: 'deletedAt', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Movie, (movie) => movie.reviews)
  movie: Movie;

  @ManyToOne(() => User, (user) => user.reviews)
  author: User;

  @OneToMany(() => ReviewLike, (reviewLike) => reviewLike.review)
  likes: ReviewLike[];
}
