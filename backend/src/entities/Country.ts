import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './Movie';

@Entity('countries')
export class Country {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    iso_3166_1: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @ManyToMany(() => Movie, (movie) => movie.productionCountries)
    movies: Movie[];
}
