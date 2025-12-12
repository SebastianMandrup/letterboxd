import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './Movie';

@Entity('cast_members')
export class CastMember {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    character: string;

    @Column({ type: 'int' })
    order: number;

    @ManyToOne(() => Movie, (movie) => movie.castMembers)
    movie: Movie;
}
