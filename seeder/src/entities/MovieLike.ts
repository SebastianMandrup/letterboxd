import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './Movie.ts';
import { User } from './User.ts';
import type { Movie as MovieType } from './Movie.ts'; // type-only
import type { User as UserType } from './User.ts'; // type-only

@Entity('movie_likes')
export class MovieLike {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('datetime', { name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Movie, (movie) => movie.likes)
  movie: MovieType;

  @ManyToOne(() => User, (user) => user.movieLikes)
  user: UserType;
}
