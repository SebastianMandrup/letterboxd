import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Movie } from './Movie';
import { User } from './User';

@Entity('views')
@Unique(['user', 'movie'])
export class View {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @CreateDateColumn()
    viewedAt: Date;

    @ManyToOne(() => Movie, (movie) => movie.views)
    movie: Movie;

    @ManyToOne(() => User, (user) => user.views)
    user: User;
}
