import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { List } from './List';
import { User } from './User';

@Entity('list_likes')
export class ListLike {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => List, (list) => list.likes)
    list: List;

    @ManyToOne(() => User, (user) => user.listLikes)
    user: User;
}
