import dotenv from 'dotenv';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Comment } from './entities/Comment.ts';
import { CommentLike } from './entities/CommentLike.ts';
import { Genre } from './entities/Genre.ts';
import { List } from './entities/List.ts';
import { ListLike } from './entities/ListLike.ts';
import { Movie } from './entities/Movie.ts';
import { MovieLike } from './entities/MovieLike.ts';
import { Review } from './entities/Review.ts';
import { ReviewLike } from './entities/ReviewLike.ts';
import { User } from './entities/User.ts';
import { View } from './entities/View.ts';

dotenv.config();

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as 'mysql' | 'postgres',
  url: process.env.DB_URL,
  schema: process.env.DB_SCHEMA,
  entities: [
    Movie,
    MovieLike,
    Review,
    ReviewLike,
    User,
    View,
    Comment,
    CommentLike,
    Genre,
    List,
    ListLike,
  ], // Registering entities with the data source
  synchronize: true, // Automatically create or modify database schema on every application launch
  logging: false, // Enable query logging for debugging purposes
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});
