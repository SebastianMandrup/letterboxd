import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.lists)
    user: User;

    @JoinTable({
        name: 'list_movie', // Join table name
        joinColumn: {
            name: 'listId', // Column name in join table pointing to List
            referencedColumnName: 'id', // Column in List entity
        },
        inverseJoinColumn: {
            name: 'movieId', // Column name in join table pointing to Movie
            referencedColumnName: 'id', // Column in Movie entity
        },
    })
    @ManyToMany(() => Movie, (movie) => movie.lists)
    movies: Movie[];

    @OneToMany(() => Comment, (comment) => comment.list)
    comments: Comment[];

    @OneToMany(() => ListLike, (listLike) => listLike.list)
    likes: ListLike[];
}
