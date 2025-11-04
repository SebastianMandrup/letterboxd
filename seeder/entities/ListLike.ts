import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { List } from './List';
import { User } from './User';

@Entity("list-likes")
export class ListLike {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("datetime", { name: "created_at" })
    createdAt: Date;

    @ManyToOne(() => List, (list) => list.likes)
    list: List;

    @ManyToOne(() => User, (user) => user.listLikes)
    user: User;
}