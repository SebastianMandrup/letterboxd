import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './Movie';

@Entity('production_companies')
export class ProductionCompany {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 2 })
    originCountry: string;

    @ManyToMany(() => Movie, (movie) => movie.productionCompanies)
    movies: Movie[];
}
