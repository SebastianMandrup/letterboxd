import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './Movie.ts';

import type { Movie as MovieType } from './Movie.ts'; // type-only

@Entity('crew_members')
export class CrewMember {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    job: string;

    @Column({ type: 'varchar', length: 255 })
    department: string;

    @ManyToOne(() => Movie, (movie) => movie.crewMembers)
    movie: MovieType;
}
