import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './Comment';
import { CommentLike } from './CommentLike';
import { List } from './List';
import { ListLike } from './ListLike';
import { MovieLike } from './MovieLike';
import { Review } from './Review';
import { ReviewLike } from './ReviewLike';
import { View } from './View';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'username', length: 255, unique: true })
  username: string;

  @Column('varchar', { name: 'password', length: 255 })
  password: string;

  @Column('varchar', { name: 'email', length: 255, unique: true })
  email: string;

  @Column('varchar', { name: 'role', length: 5, default: 'user' })
  role: string;

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
