import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Genre } from './Genre.ts'; // runtime import
import { List } from './List.ts'; // runtime import
import { MovieLike } from './MovieLike.ts'; // runtime import
import { Review } from './Review.ts'; // runtime import
import { View } from './View.ts'; // runtime import

// type-only imports for TypeScript type safety
import type { Genre as GenreType } from './Genre.ts';
import type { List as ListType } from './List.ts';
import type { MovieLike as MovieLikeType } from './MovieLike.ts';
import type { Review as ReviewType } from './Review.ts';
import type { View as ViewType } from './View.ts';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Index()
  @Column('varchar', { name: 'title', length: 255 })
  title: string;

  @Column('varchar', { name: 'originalTitle', length: 255, nullable: true })
  originalTitle?: string;

  @Column('boolean', { name: 'adult', default: false })
  adult: boolean;

  @Column('text', { name: 'overview', nullable: true })
  overview?: string;

  @Column('varchar', { name: 'posterUrl', nullable: true })
  posterUrl?: string;

  @Column('varchar', { name: 'backdropUrl', nullable: true })
  backdropUrl?: string;

  @Column('date', { name: 'releaseDate', nullable: true })
  releaseDate?: Date;

  @Column('float', { name: 'voteAverage', nullable: true })
  voteAverage?: number;

  @Column('int', { name: 'voteCount', nullable: true })
  voteCount?: number;

  @OneToMany(() => Review, (review) => review.movie)
  reviews: ReviewType[];

  @OneToMany(() => View, (view) => view.movie)
  views: ViewType[];

  @OneToMany(() => MovieLike, (like) => like.movie)
  likes: MovieLikeType[];

  @JoinTable()
  @ManyToMany(() => Genre, (genre) => genre.movies)
  genres: GenreType[];

  @ManyToMany(() => List, (list) => list.movies)
  lists: ListType[];
}
