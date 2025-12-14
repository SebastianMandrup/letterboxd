import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Movie } from './Movie';
import { ReviewLike } from './ReviewLike';
import { User } from './User';

import type { Movie as MovieType } from './Movie.ts'; // type-only
import type { User as UserType } from './User.ts'; // type-only

@Entity('reviews')
@Unique(['author', 'movie'])
export class Review {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('text', { name: 'review' })
    review: string;

    @Column('float', { name: 'rating' })
    rating: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Movie, (movie) => movie.reviews)
    movie: MovieType;

    @ManyToOne(() => User, (user) => user.reviews)
    author: UserType;

    @OneToMany(() => ReviewLike, (reviewLike) => reviewLike.review, { cascade: true, onDelete: 'CASCADE' })
    likes: ReviewLike[];

    likeCount: number;

    isLiked: boolean;
}
