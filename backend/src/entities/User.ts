import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Comment } from './Comment';
import { CommentLike } from './CommentLike';
import { List } from './List';
import { ListLike } from './ListLike';
import { MovieLike } from './MovieLike';
import { Review } from './Review';
import { ReviewLike } from './ReviewLike';
import { View } from './View';
import { Movie } from './Movie';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('varchar', { name: 'username', length: 255, unique: true })
    username: string;

    @Column('varchar', { name: 'password', length: 255 })
    password: string;

    @Column('varchar', { name: 'email', length: 255, unique: true })
    email: string;

    @Column('varchar', { name: 'role', length: 5, default: 'user' })
    role: string;

    @Column('varchar', { name: 'bio', length: 255, nullable: true })
    bio: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Review, (review) => review.author)
    reviews: Review[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => List, (list) => list.user)
    lists: List[];

    @OneToMany(() => View, (view) => view.user)
    views: View[];

    @OneToMany(() => CommentLike, (commentLike) => commentLike.user)
    commentLikes: CommentLike[];

    @OneToMany(() => ReviewLike, (reviewLike) => reviewLike.user)
    reviewLikes: ReviewLike[];

    @OneToMany(() => MovieLike, (movieLike) => movieLike.user)
    movieLikes: MovieLike[];

    @OneToMany(() => ListLike, (listLike) => listLike.user)
    listLikes: ListLike[];

    @ManyToMany(() => User, (user) => user.followers)
    @JoinTable({
        name: 'user_following',
        joinColumn: {
            name: 'follower_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'following_id',
            referencedColumnName: 'id',
        },
    })
    following: User[];

    @ManyToMany(() => User, (user) => user.following)
    followers: User[];

    numberOfReviews?: number;

    numberOfWatchedFilms?: number;

    reviewLikeCount?: number;

    recentlyWatchedMovies?: Movie[];

    isFollowed?: boolean;
}
