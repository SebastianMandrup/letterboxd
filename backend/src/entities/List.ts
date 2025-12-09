import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from './Comment';
import { ListLike } from './ListLike';
import { Movie } from './Movie';
import { User } from './User';

@Entity('lists')
export class List {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('varchar', { name: 'name', length: 255, unique: true })
    name: string;

    @Column('text', { name: 'description', nullable: true })
    description: string;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.lists)
    user: User;

    @JoinTable({
        name: 'lists_movies_movies',
        joinColumn: {
            name: 'listsId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'moviesId',
            referencedColumnName: 'id',
        },
    })
    @ManyToMany(() => Movie, (movie) => movie.lists)
    movies: Movie[];

    @OneToMany(() => Comment, (comment) => comment.list)
    comments: Comment[];

    @OneToMany(() => ListLike, (listLike) => listLike.list)
    likes: ListLike[];
}
