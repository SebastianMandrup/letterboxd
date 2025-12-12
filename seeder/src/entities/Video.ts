import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './Movie.ts';

import type { Movie as MovieType } from './Movie.ts'; // type-only

@Entity('videos')
export class Video {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    key: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    site: string;

    @Column({ type: 'varchar', length: 255 })
    type: string;

    @ManyToOne(() => Movie, (movie) => movie.videos)
    movie: MovieType;
}
