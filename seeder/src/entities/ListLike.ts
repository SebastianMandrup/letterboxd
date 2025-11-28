import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { List } from './List.ts';
import { User } from './User.ts';
import type { List as ListType } from './List.ts'; // type-only
import type { User as UserType } from './User.ts'; // type-only

@Entity('list_likes')
export class ListLike {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('datetime', { name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => List, (list) => list.likes)
  list: ListType;

  @ManyToOne(() => User, (user) => user.listLikes)
  user: UserType;
}
