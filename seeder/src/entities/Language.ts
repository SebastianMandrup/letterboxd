import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './Movie.ts';

import type { Movie as MovieType } from './Movie.ts'; // type-only

@Entity('languages')
export class Language {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    iso_639_1: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255 })
    english_name: string;

    @ManyToMany(() => Movie, (movie) => movie.languages)
    movies: MovieType[];
}
