import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Review } from './Review';


@Entity("users", { schema: "letterboxd" })
export class User {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("varchar", { name: "name", length: 255, unique: true })
    name: string;

    @Column("varchar", { name: "password", length: 255 })
    password: string;

    @OneToMany(() => Review, (review) => review.author)
    reviews: Review[];
}