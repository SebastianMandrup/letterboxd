import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './Comment.ts';
import { User } from './User.ts';

import type { Comment as CommentType } from './Comment.ts'; // type-only
import type { User as UserType } from './User.ts'; // type-only

@Entity('comment_likes')
export class CommentLike {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('datetime', { name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Comment, (comment) => comment.likes)
  comment: CommentType;

  @ManyToOne(() => User, (user) => user.commentLikes)
  user: UserType;
}
