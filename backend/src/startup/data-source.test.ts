import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Movie } from '../entities/Movie';
import { View } from '../entities/View';
import { Review } from '../entities/Review';
import { MovieLike } from '../entities/MovieLike';
import { ReviewLike } from '../entities/ReviewLike';
import { CommentLike } from '../entities/CommentLike';
import { Comment } from '../entities/Comment';
import { Genre } from '../entities/Genre';
import { List } from '../entities/List';
import { ListLike } from '../entities/ListLike';

export const TestDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    entities: [Movie, MovieLike, Review, ReviewLike, User, View, Comment, CommentLike, Genre, List, ListLike],
    synchronize: true,
    logging: false,
});
